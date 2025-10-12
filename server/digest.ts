/**
 * ParentFlow POC - Daily Digest Email System
 * Locale: he-IL | TZ: Asia/Jerusalem | RTL UI
 * No PII in logs.
 * Use Zod for validation; pure functions for parsing/date resolution.
 */

import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { toZonedTime, format } from 'date-fns-tz';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { he } from 'date-fns/locale';

const prisma = new PrismaClient();
const TIMEZONE = 'Asia/Jerusalem';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface DigestData {
  date: string;
  formattedDate: string;
  tasks: {
    pending: any[];
    completed: any[];
    overdue: any[];
  };
  events: any[];
  analytics: {
    totalMinutesSaved: number;
    tasksProcessed: number;
    completionRate: number;
  };
}

export async function generateDailyDigest(): Promise<DigestData> {
  const now = toZonedTime(new Date(), TIMEZONE);
  const today = format(now, 'yyyy-MM-dd');
  const yesterday = format(addDays(now, -1), 'yyyy-MM-dd');
  
  // Get today's tasks
  const todayTasks = await prisma.task.findMany({
    where: {
      dueDate: today
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  // Get overdue tasks
  const overdueTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        lt: today
      },
      status: 'open'
    },
    orderBy: { dueDate: 'asc' },
    take: 10
  });

  // Get today's events
  const todayEvents = await prisma.event.findMany({
    where: {
      startTime: {
        startsWith: today
      }
    },
    orderBy: { startTime: 'asc' }
  });

  // Get analytics for yesterday
  const yesterdayAnalytics = await prisma.analyticsTime.findFirst({
    where: {
      period: yesterday
    }
  });

  // Calculate completion rate
  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter(task => task.status === 'done').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    date: today,
    formattedDate: format(now, 'EEEE, d MMMM yyyy', { locale: he }),
    tasks: {
      pending: todayTasks.filter(task => task.status === 'open'),
      completed: todayTasks.filter(task => task.status === 'done'),
      overdue: overdueTasks
    },
    events: todayEvents,
    analytics: {
      totalMinutesSaved: yesterdayAnalytics?.timeSavedMinutes || 0,
      tasksProcessed: todayTasks.length,
      completionRate: Math.round(completionRate)
    }
  };
}

export function generateHebrewEmailHTML(digestData: DigestData): string {
  const { tasks, events, analytics, formattedDate } = digestData;
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ParentFlow - סיכום יומי</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
            color: #1e293b;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 30px;
            padding-bottom: 25px;
            border-bottom: 1px solid #e2e8f0;
        }
        .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e3a5f;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .task-item, .event-item {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            border-right: 4px solid #94a3b8;
        }
        .task-item.high-priority {
            border-right-color: #ef4444;
            background: #fef2f2;
        }
        .task-item.completed {
            border-right-color: #22c55e;
            background: #f0fdf4;
            opacity: 0.8;
        }
        .task-item.overdue {
            border-right-color: #f59e0b;
            background: #fffbeb;
        }
        .task-title {
            font-weight: 600;
            margin-bottom: 5px;
        }
        .task-meta {
            font-size: 14px;
            color: #64748b;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        .analytics-card {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .analytics-number {
            font-size: 24px;
            font-weight: 700;
            color: #1e3a5f;
            margin-bottom: 5px;
        }
        .analytics-label {
            font-size: 14px;
            color: #64748b;
        }
        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .emoji {
            font-size: 18px;
        }
        .no-items {
            text-align: center;
            color: #64748b;
            font-style: italic;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 ParentFlow - היום שלי</h1>
            <p>${formattedDate}</p>
        </div>
        
        <div class="content">
            <!-- Analytics Section -->
            <div class="section">
                <div class="section-title">
                    <span class="emoji">📊</span>
                    סטטיסטיקות אתמול
                </div>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="analytics-number">${analytics.totalMinutesSaved}</div>
                        <div class="analytics-label">דקות שנחסכו</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-number">${analytics.tasksProcessed}</div>
                        <div class="analytics-label">משימות נוצרו</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-number">${analytics.completionRate}%</div>
                        <div class="analytics-label">אחוז השלמה</div>
                    </div>
                </div>
            </div>

            <!-- Pending Tasks -->
            <div class="section">
                <div class="section-title">
                    <span class="emoji">📝</span>
                    משימות להיום (${tasks.pending.length})
                </div>
                ${tasks.pending.length > 0 ? 
                    tasks.pending.map(task => `
                        <div class="task-item ${task.priority === 'high' ? 'high-priority' : ''}">
                            <div class="task-title">${task.title}</div>
                            <div class="task-meta">
                                ${task.category === 'equipment' ? '🎒' : 
                                  task.category === 'homework' ? '📚' : 
                                  task.category === 'payment' ? '💳' : 
                                  task.category === 'gift' ? '🎁' : '📋'} 
                                ${task.category || 'כללי'} 
                                ${task.priority === 'high' ? '⚠️ חשוב' : ''}
                            </div>
                        </div>
                    `).join('') :
                    '<div class="no-items">אין משימות להיום 🎉</div>'
                }
            </div>

            <!-- Overdue Tasks -->
            ${tasks.overdue.length > 0 ? `
            <div class="section">
                <div class="section-title">
                    <span class="emoji">⏰</span>
                    משימות באיחור (${tasks.overdue.length})
                </div>
                ${tasks.overdue.map(task => `
                    <div class="task-item overdue">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">
                            איחור מ-${task.dueDate}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- Events -->
            <div class="section">
                <div class="section-title">
                    <span class="emoji">🗓️</span>
                    אירועים להיום (${events.length})
                </div>
                ${events.length > 0 ? 
                    events.map(event => `
                        <div class="event-item">
                            <div class="task-title">${event.title}</div>
                            <div class="task-meta">
                                📍 ${event.location || 'ללא מיקום'} 
                                ⏰ ${event.startTime.split('T')[1]?.substring(0, 5) || ''}
                            </div>
                        </div>
                    `).join('') :
                    '<div class="no-items">אין אירועים מתוכננים להיום</div>'
                }
            </div>

            <!-- Completed Tasks -->
            ${tasks.completed.length > 0 ? `
            <div class="section">
                <div class="section-title">
                    <span class="emoji">✅</span>
                    משימות שהושלמו (${tasks.completed.length})
                </div>
                ${tasks.completed.map(task => `
                    <div class="task-item completed">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">הושלם ✓</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <p>📱 ParentFlow POC - חוסך זמן יקר להורים</p>
            <p>נוצר באוטומטית ב-${format(toZonedTime(new Date(), TIMEZONE), 'HH:mm')} 🕐</p>
        </div>
    </div>
</body>
</html>`;
}

export async function sendDailyDigest(userEmail: string): Promise<boolean> {
  try {
    const digestData = await generateDailyDigest();
    const htmlContent = generateHebrewEmailHTML(digestData);
    
    const info = await transporter.sendMail({
      from: `"ParentFlow POC" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `📅 היום שלי - ${digestData.formattedDate}`,
      html: htmlContent,
    });

    console.log('📧 Daily digest sent successfully:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('❌ Failed to send daily digest:', error);
    return false;
  }
}

export async function sendDigestToAllUsers(): Promise<void> {
  try {
    // For POC, we'll use a default email from environment
    const defaultEmail = process.env.DEFAULT_DIGEST_EMAIL;
    
    if (!defaultEmail) {
      console.log('⚠️ No default email configured for digest');
      return;
    }

    console.log('📧 Sending daily digest...');
    const success = await sendDailyDigest(defaultEmail);
    
    if (success) {
      console.log('✅ Daily digest sent successfully');
    } else {
      console.log('❌ Failed to send daily digest');
    }
    
  } catch (error) {
    console.error('❌ Error in sendDigestToAllUsers:', error);
  }
}

// Manual trigger for testing
if (process.argv.includes('--send-now')) {
  sendDigestToAllUsers().then(() => {
    console.log('📧 Manual digest trigger completed');
    process.exit(0);
  });
}