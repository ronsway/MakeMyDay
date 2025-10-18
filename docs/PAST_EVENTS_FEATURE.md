# Past Events Feature

## Overview
Added a collapsible "Past Events" section to the dashboard that shows events from the last 7 days, allowing users to review recent history without cluttering the main today view.

## Implementation Date
October 18, 2025

## Features

### 1. Past Events Filter (`DataContext.jsx`)
- **Time Range**: Shows events from the last 7 days (excluding today)
- **Sorting**: Most recent events first (descending order)
- **Filtering**: Respects child selection (when filtering by specific child)
- **Auto-exclude**: Past events don't appear in "Today's Events"

### 2. Collapsible Section (`TodayView.jsx`)
- **Toggle Button**: Click to expand/collapse past events
- **Event Count Badge**: Shows number of past events (e.g., "Past Events (3)")
- **Animated Expand/Collapse**: Smooth height transition using Framer Motion
- **Visual Indicator**: Past events appear with 60% opacity (faded) and return to full opacity on hover
- **Chevron Icon**: Rotates 180° when expanded

### 3. User Experience
- **Default State**: Collapsed (doesn't take space unless user wants to see it)
- **Smart Display**: Only shows if there are past events to display
- **Edit & Delete**: Full functionality - users can still edit or delete past events
- **Child Filtering**: Respects the selected child filter
- **Positioned**: Appears right below "Today's Events" section

## Technical Implementation

### Data Flow
```
DataContext.jsx
├── todaysEvents (today + future)
└── pastEvents (last 7 days, sorted by date desc)
    
TodayView.jsx
├── Today's Events Section
└── Past Events Section (collapsible)
    └── EventCard (with reduced opacity)
```

### Key Code Components

#### Filter Logic (DataContext.jsx)
```javascript
const pastEvents = filteredEvents.filter((e) => {
  const eventDate = e.startTime.split('T')[0];
  const eventDateObj = new Date(eventDate);
  const isPast = eventDateObj < todayDate;
  
  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isWithinLast7Days = eventDateObj >= sevenDaysAgo;
  
  return isPast && isWithinLast7Days;
}).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
```

#### UI Component (TodayView.jsx)
- Collapsible button with event count
- AnimatePresence for smooth animations
- Reduced opacity for "past" visual cue
- Full edit/delete functionality

## Translations

### English
- `dashboard.pastEvents`: "Past Events"

### Hebrew
- `dashboard.pastEvents`: "אירועים קודמים"

## Visual Design

### Past Events Header
- White background with shadow
- Calendar icon (gray/silver tone)
- Event count in parentheses
- Chevron down icon that rotates on expand
- Hover effect for better interactivity

### Past Event Cards
- Same design as regular EventCard
- 60% opacity (faded appearance)
- 100% opacity on hover
- Full color badges (date, time, location)

## User Scenarios

### Scenario 1: Review Recent History
1. User opens dashboard
2. Sees "Past Events (3)" button below today's events
3. Clicks to expand
4. Views last week's events with dates
5. Can verify what happened yesterday or earlier this week

### Scenario 2: Edit Past Event
1. User expands past events
2. Hovers over a past event (full opacity)
3. Clicks edit button
4. Can reschedule or update details
5. Event moves to "Today's Events" if rescheduled to today/future

### Scenario 3: Clean Up History
1. User reviews past events
2. Identifies events that are no longer needed
3. Deletes them to keep data clean
4. Section auto-hides when no past events remain

## Configuration Options

### Time Range (Currently: 7 days)
To change the time range, modify the `sevenDaysAgo` calculation in `DataContext.jsx`:

```javascript
// For 14 days:
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

// For 30 days:
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
```

### Default Expanded State
To show past events expanded by default, change the initial state in `TodayView.jsx`:

```javascript
const [showPastEvents, setShowPastEvents] = useState(true); // Changed from false
```

### Opacity Level
To adjust the faded appearance, modify the opacity class:

```javascript
<div className="opacity-75 hover:opacity-100"> // Changed from opacity-60
```

## Future Enhancements

### Potential Improvements
1. **Date Grouping**: Group past events by date (Yesterday, 2 days ago, etc.)
2. **Search/Filter**: Add search within past events
3. **Pagination**: Load older events on demand (e.g., "Load more")
4. **Export**: Export past events to calendar format
5. **Statistics**: Show summary stats (e.g., "5 events last week")
6. **Archive Status**: Mark events as "archived" vs "active history"
7. **User Preference**: Remember collapsed/expanded state in localStorage
8. **Custom Date Range**: Let users choose how far back to show (7/14/30 days)

## Testing Checklist

- [x] Past events show correctly (last 7 days)
- [x] Today's events exclude past events
- [x] Sorting works (most recent first)
- [x] Collapse/expand animation smooth
- [x] Event count badge accurate
- [x] Opacity transitions on hover
- [x] Edit functionality works for past events
- [x] Delete functionality works for past events
- [x] Child filtering applies to past events
- [x] Section hides when no past events
- [x] Translations work in English and Hebrew
- [ ] Test with events from different dates
- [ ] Test with large number of past events (10+)
- [ ] Test on mobile devices
- [ ] Test in RTL (Hebrew) layout

## Related Files
- `src/contexts/DataContext.jsx` - Data filtering logic
- `src/pages/dashboard/TodayView.jsx` - UI component
- `src/components/EventCard.jsx` - Event display
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/he.json` - Hebrew translations

## Related Features
- Today's Events (main events section)
- Event filtering by child
- Event editing and deletion
- Date/time formatting with user settings
