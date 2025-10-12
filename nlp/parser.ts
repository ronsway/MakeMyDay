/**
 * ParentFlow POC
 * Locale: he-IL | TZ: Asia/Jerusalem | RTL UI
 * No PII in logs.
 * Use Zod for validation; pure functions for parsing/date resolution.
 */

import { z } from 'zod';
import { addDays, nextMonday, addWeeks, setHours, setMinutes, parse } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export const ParsedEntitySchema = z.object({
  intents: z.array(z.string()),
  entities: z.object({
    date: z.string().nullable().optional(),
    time: z.string().nullable().optional(),
    item: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    context: z.string().nullable().optional(),
    priority: z.enum(['normal', 'high']).optional(),
    location: z.string().nullable().optional(),
  }),
  confidence: z.number(),
  type: z.enum(['task', 'event']),
});

export type ParsedEntity = z.infer<typeof ParsedEntitySchema>;

// Hebrew action verbs for task detection
const ACTION_VERBS = [
  'להביא', 'להכין', 'לשלוח', 'ללבוש', 'לשלם', 'לקנות', 'לעשות',
  'להגיש', 'להחזיר', 'לכתוב', 'לקרוא', 'להשלים', 'לסיים'
];

// Keywords indicating necessity/urgency
const NECESSITY_KEYWORDS = [
  'חובה', 'נא', 'צריך', 'יש להביא', 'נדרש', 'חשוב', 'עד', 'לא לשכוח'
];

// Hebrew weekdays mapping
const WEEKDAYS = {
  'ראשון': 1, 'שני': 2, 'שלישי': 3, 'רביעי': 4, 'חמישי': 5, 'שישי': 6, 'שבת': 0,
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ש': 0
};

// Item categories
const ITEM_CATEGORIES = {
  equipment: ['חולצה', 'כובע', 'נעליים', 'בגדים', 'תיק', 'בקבוק', 'מים'],
  homework: ['שיעורי בית', 'מטלה', 'פרויקט', 'עבודה', 'חשבון', 'קריאה'],
  payment: ['תשלום', 'כסף', 'שקל', 'שקלים', 'ש״ח'],
  gift: ['מתנה', 'עוגה', 'פרחים', 'כרטיס ברכה'],
  other: ['תמונות', 'מסמכים', 'טופס', 'אישור']
};

// Context keywords for events
const EVENT_CONTEXTS = [
  'טקס', 'חגיגה', 'מסיבה', 'טיול', 'ישיבת הורים', 'הצגה', 'פעילות',
  'שיעור', 'אירוע', 'פגישה', 'בדיקה', 'מבחן'
];

// Time expressions
const TIME_EXPRESSIONS = {
  'בבוקר': 8,
  'בצהריים': 12,
  'אחה״צ': 16,
  'בערב': 19,
  'בלילה': 22
};

export function parseHebrewText(text: string, refDate: Date, tz: string = 'Asia/Jerusalem'): ParsedEntity[] {
  const results: ParsedEntity[] = [];
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  
  // Convert reference date to timezone
  const zonedRefDate = toZonedTime(refDate, tz);
  
  // Extract date information
  const dateInfo = extractDate(normalizedText, zonedRefDate);
  const timeInfo = extractTime(normalizedText);
  
  // Detect if it's primarily a task or event
  const hasActionVerb = ACTION_VERBS.some(verb => normalizedText.includes(verb));
  const hasEventContext = EVENT_CONTEXTS.some(context => normalizedText.includes(context));
  
  if (hasActionVerb || (!hasEventContext && dateInfo)) {
    // Parse as task
    const taskEntities = parseAsTask(normalizedText, dateInfo, timeInfo);
    if (taskEntities.length > 0) {
      results.push(...taskEntities);
    }
  }
  
  if (hasEventContext || (!hasActionVerb && dateInfo && timeInfo)) {
    // Parse as event
    const eventEntity = parseAsEvent(normalizedText, dateInfo, timeInfo);
    if (eventEntity) {
      results.push(eventEntity);
    }
  }
  
  // If no specific patterns found, try to extract any date-related information
  if (results.length === 0 && dateInfo) {
    const fallbackEntity = createFallbackEntity(normalizedText, dateInfo, timeInfo);
    if (fallbackEntity) {
      results.push(fallbackEntity);
    }
  }
  
  return results;
}

function extractDate(text: string, refDate: Date): string | null {
  // Relative dates
  if (text.includes('היום')) return refDate.toISOString().split('T')[0];
  if (text.includes('מחר')) return addDays(refDate, 1).toISOString().split('T')[0];
  if (text.includes('מחרתיים')) return addDays(refDate, 2).toISOString().split('T')[0];
  
  // Next week
  if (text.includes('בשבוע הבא')) {
    return nextMonday(refDate).toISOString().split('T')[0];
  }
  
  // Specific weekdays
  for (const [hebrewDay, dayNum] of Object.entries(WEEKDAYS)) {
    if (text.includes(`ביום ${hebrewDay}`)) {
      const nextDate = getNextWeekday(refDate, dayNum);
      if (text.includes('הבא')) {
        return addWeeks(nextDate, 1).toISOString().split('T')[0];
      }
      return nextDate.toISOString().split('T')[0];
    }
  }
  
  // Explicit dates (dd/mm or dd.mm)
  const dateMatch = text.match(/(\d{1,2})[\/\.](\d{1,2})/);
  if (dateMatch) {
    const [, day, month] = dateMatch;
    const currentYear = refDate.getFullYear();
    const parsedDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    
    // If date has passed this year, assume next year
    if (parsedDate < refDate) {
      parsedDate.setFullYear(currentYear + 1);
    }
    
    return parsedDate.toISOString().split('T')[0];
  }
  
  return null;
}

function extractTime(text: string): string | null {
  // Specific time patterns (HH:MM)
  const timeMatch = text.match(/בשעה (\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const [, hours, minutes] = timeMatch;
    return `${hours.padStart(2, '0')}:${minutes}`;
  }
  
  // General time expressions
  for (const [expression, hour] of Object.entries(TIME_EXPRESSIONS)) {
    if (text.includes(expression)) {
      return `${hour.toString().padStart(2, '0')}:00`;
    }
  }
  
  return null;
}

function parseAsTask(text: string, date: string | null, time: string | null): ParsedEntity[] {
  const tasks: ParsedEntity[] = [];
  
  // Extract items/objects
  const items = extractItems(text);
  const category = categorizeItems(items);
  const priority = detectPriority(text);
  
  if (items.length > 0) {
    items.forEach(item => {
      tasks.push({
        intents: ['bring'],
        entities: {
          date,
          time,
          item,
          category,
          priority
        },
        confidence: 0.85,
        type: 'task'
      });
    });
  } else {
    // Generic task
    const title = extractMainAction(text);
    if (title) {
      tasks.push({
        intents: ['do'],
        entities: {
          date,
          time,
          item: title,
          category: 'other',
          priority
        },
        confidence: 0.7,
        type: 'task'
      });
    }
  }
  
  return tasks;
}

function parseAsEvent(text: string, date: string | null, time: string | null): ParsedEntity | null {
  const context = extractEventContext(text);
  const location = extractLocation(text);
  
  if (context || date) {
    return {
      intents: ['attend'],
      entities: {
        date,
        time,
        context: context || 'אירוע',
        location
      },
      confidence: 0.8,
      type: 'event'
    };
  }
  
  return null;
}

function createFallbackEntity(text: string, date: string | null, time: string | null): ParsedEntity | null {
  if (!date) return null;
  
  return {
    intents: ['reminder'],
    entities: {
      date,
      time,
      item: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
      category: 'other'
    },
    confidence: 0.6,
    type: 'task'
  };
}

function extractItems(text: string): string[] {
  const items: string[] = [];
  
  // Look for items in all categories
  for (const [category, itemList] of Object.entries(ITEM_CATEGORIES)) {
    for (const item of itemList) {
      if (text.includes(item)) {
        items.push(item);
      }
    }
  }
  
  return [...new Set(items)]; // Remove duplicates
}

function categorizeItems(items: string[]): string {
  for (const [category, itemList] of Object.entries(ITEM_CATEGORIES)) {
    if (items.some(item => itemList.includes(item))) {
      return category;
    }
  }
  return 'other';
}

function detectPriority(text: string): 'normal' | 'high' {
  const hasUrgency = NECESSITY_KEYWORDS.some(keyword => text.includes(keyword));
  return hasUrgency ? 'high' : 'normal';
}

function extractMainAction(text: string): string | null {
  // Try to extract the main action/task from the text
  for (const verb of ACTION_VERBS) {
    if (text.includes(verb)) {
      // Extract text around the verb
      const verbIndex = text.indexOf(verb);
      const afterVerb = text.slice(verbIndex).split(' ').slice(0, 5).join(' ');
      return afterVerb;
    }
  }
  return null;
}

function extractEventContext(text: string): string | null {
  for (const context of EVENT_CONTEXTS) {
    if (text.includes(context)) {
      return context;
    }
  }
  return null;
}

function extractLocation(text: string): string | null {
  // Simple location detection - could be enhanced
  const locationMatch = text.match(/ב([א-ת\s]{2,20}(?:בית ספר|גן|כיתה|אולם))/);
  return locationMatch ? locationMatch[1] : null;
}

function getNextWeekday(date: Date, targetDay: number): Date {
  const currentDay = date.getDay();
  const daysUntilTarget = (targetDay - currentDay + 7) % 7;
  return addDays(date, daysUntilTarget === 0 ? 7 : daysUntilTarget);
}