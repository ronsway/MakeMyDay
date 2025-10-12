/**
 * ParentFlow POC - Scheduled Tasks
 * Locale: he-IL | TZ: Asia/Jerusalem | RTL UI
 * No PII in logs.
 * Use Zod for validation; pure functions for parsing/date resolution.
 */

import cron from 'node-cron';
import { sendDigestToAllUsers } from './digest.js';
import { PrismaClient } from '@prisma/client';
import { toZonedTime, format } from 'date-fns-tz';

const prisma = new PrismaClient();
const TIMEZONE = 'Asia/Jerusalem';

console.log('🕐 ParentFlow POC Scheduler started');
console.log(`📍 Timezone: ${TIMEZONE}`);
console.log(`⏰ Current time: ${format(toZonedTime(new Date(), TIMEZONE), 'HH:mm:ss dd/MM/yyyy')}`);

// Daily digest at 7:00 AM Jerusalem time
cron.schedule('0 7 * * *', async () => {
  const now = toZonedTime(new Date(), TIMEZONE);
  console.log(`📧 [${format(now, 'HH:mm:ss')}] Triggering daily digest...`);
  
  try {
    await sendDigestToAllUsers();
    console.log('✅ Daily digest job completed successfully');
  } catch (error) {
    console.error('❌ Daily digest job failed:', error);
  }
}, {
  timezone: TIMEZONE
});

// Cleanup old analytics data (monthly)
cron.schedule('0 2 1 * *', async () => {
  const now = toZonedTime(new Date(), TIMEZONE);
  console.log(`🧹 [${format(now, 'HH:mm:ss')}] Running monthly cleanup...`);
  
  try {
    // Keep only last 90 days of analytics
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    
    const deleted = await prisma.analyticsTime.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });
    
    console.log(`🗑️ Cleaned up ${deleted.count} old analytics records`);
  } catch (error) {
    console.error('❌ Cleanup job failed:', error);
  }
}, {
  timezone: TIMEZONE
});

// Task reminder (every 2 hours during day)
cron.schedule('0 8,10,12,14,16,18 * * *', async () => {
  const now = toZonedTime(new Date(), TIMEZONE);
  console.log(`⏰ [${format(now, 'HH:mm:ss')}] Running task reminder check...`);
  
  try {
    const today = format(now, 'yyyy-MM-dd');
    
    // Check for high priority tasks due today
    const urgentTasks = await prisma.task.findMany({
      where: {
        dueDate: today,
        status: 'open',
        priority: 'high'
      }
    });
    
    if (urgentTasks.length > 0) {
      console.log(`⚠️ Found ${urgentTasks.length} urgent tasks due today`);
      // In a real implementation, this could send push notifications
      // or trigger additional email alerts
    }
    
  } catch (error) {
    console.error('❌ Task reminder check failed:', error);
  }
}, {
  timezone: TIMEZONE
});

// Health check (every hour)
cron.schedule('0 * * * *', async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    // Silent health check - only log if there's an issue
  } catch (error) {
    const now = toZonedTime(new Date(), TIMEZONE);
    console.error(`❌ [${format(now, 'HH:mm:ss')}] Database health check failed:`, error);
  }
}, {
  timezone: TIMEZONE
});

console.log('📋 Scheduled jobs:');
console.log('  📧 Daily digest: 7:00 AM');
console.log('  🧹 Monthly cleanup: 2:00 AM (1st of month)');
console.log('  ⏰ Task reminders: Every 2 hours (8 AM - 6 PM)');
console.log('  💚 Health checks: Every hour');
console.log('🚀 Scheduler is running...');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down scheduler...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});