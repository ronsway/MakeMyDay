/**
 * Comprehensive Prisma + SQLite Database Test
 * Run with: node test-database.js
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabase() {
  console.log('🚀 Starting Comprehensive Database Test...\n');

  try {
    // Test 1: Connection Test
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    // Test 2: Check if tables exist (run a simple query)
    console.log('2️⃣ Testing table structure...');
    try {
      const tableCount = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'
      `;
      console.log('✅ Database tables accessible:', tableCount);
    } catch (error) {
      console.log('❌ Error accessing tables:', error.message);
    }

    // Test 3: Create Test User
    console.log('\n3️⃣ Testing User creation...');
    try {
      const testUser = await prisma.user.create({
        data: {
          email: 'test@parentflow.com',
          passwordHash: 'hashed_password_123',
          name: 'Test Parent',
          phone: '050-123-4567',
          locale: 'he',
          timezone: 'Asia/Jerusalem',
        },
      });
      console.log('✅ User created:', testUser.name, testUser.email);
      
      // Test 4: Create Test Family
      console.log('\n4️⃣ Testing Family creation...');
      const testFamily = await prisma.family.create({
        data: {
          name: 'משפחת בדיקה',
        },
      });
      console.log('✅ Family created:', testFamily.name);

      // Test 5: Create Family Member relationship
      console.log('\n5️⃣ Testing Family Member relationship...');
      const familyMember = await prisma.familyMember.create({
        data: {
          familyId: testFamily.id,
          userId: testUser.id,
          role: 'admin',
        },
      });
      console.log('✅ Family member relationship created');

      // Test 6: Create Test Child
      console.log('\n6️⃣ Testing Child creation...');
      const testChild = await prisma.child.create({
        data: {
          familyId: testFamily.id,
          name: 'דני',
          grade: 'ב',
          school: 'בית ספר יסודי',
          className: 'ב1',
          birthDate: '2016-05-15',
          avatar: '👦',
        },
      });
      console.log('✅ Child created:', testChild.name);

      // Test 7: Create Test Task
      console.log('\n7️⃣ Testing Task creation...');
      const testTask = await prisma.task.create({
        data: {
          userId: testUser.id,
          childId: testChild.id,
          title: 'הביאו חליפת ספורט',
          description: 'לשיעור התעמלות ביום חמישי',
          dueDate: '2025-10-20',
          dueTime: '08:00',
          priority: 'normal',
          status: 'open',
        },
      });
      console.log('✅ Task created:', testTask.title);

      // Test 8: Create Test Event
      console.log('\n8️⃣ Testing Event creation...');
      const testEvent = await prisma.event.create({
        data: {
          userId: testUser.id,
          childId: testChild.id,
          title: 'יום הולדת בכיתה',
          description: 'חגיגה בכיתה של שרה',
          startTime: '2025-10-25T14:00:00Z',
          endTime: '2025-10-25T16:00:00Z',
          allDay: false,
          location: 'כיתה ב1',
        },
      });
      console.log('✅ Event created:', testEvent.title);

      // Test 9: Query with Relations
      console.log('\n9️⃣ Testing complex queries with relations...');
      const userWithData = await prisma.user.findFirst({
        where: { email: 'test@parentflow.com' },
        include: {
          families: {
            include: {
              family: {
                include: {
                  children: true,
                },
              },
            },
          },
          tasks: {
            include: {
              child: true,
            },
          },
          events: {
            include: {
              child: true,
            },
          },
        },
      });
      
      console.log('✅ User with relations loaded:');
      console.log('   - Families:', userWithData.families.length);
      console.log('   - Children:', userWithData.families[0]?.family.children.length || 0);
      console.log('   - Tasks:', userWithData.tasks.length);
      console.log('   - Events:', userWithData.events.length);

      // Test 10: Full-text search simulation
      console.log('\n🔍 Testing search queries...');
      const searchTasks = await prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: 'ספורט' } },
            { description: { contains: 'ספורט' } },
          ],
        },
        include: {
          child: true,
        },
      });
      console.log('✅ Search results:', searchTasks.length, 'tasks found');

      // Test 11: Date-based queries
      console.log('\n📅 Testing date queries...');
      const upcomingTasks = await prisma.task.findMany({
        where: {
          dueDate: {
            gte: '2025-10-17',
          },
          status: 'open',
        },
        orderBy: {
          dueDate: 'asc',
        },
      });
      console.log('✅ Upcoming tasks:', upcomingTasks.length);

      // Cleanup Test Data
      console.log('\n🧹 Cleaning up test data...');
      await prisma.task.deleteMany({ where: { userId: testUser.id } });
      await prisma.event.deleteMany({ where: { userId: testUser.id } });
      await prisma.child.deleteMany({ where: { familyId: testFamily.id } });
      await prisma.familyMember.deleteMany({ where: { familyId: testFamily.id } });
      await prisma.family.delete({ where: { id: testFamily.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
      console.log('✅ Test data cleaned up');

    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🏁 Database test completed!');
  }
}

// Additional utility functions
async function checkDatabaseInfo() {
  console.log('\n📊 Database Information:');
  
  try {
    // Get SQLite version
    const version = await prisma.$queryRaw`SELECT sqlite_version() as version`;
    console.log('SQLite Version:', version[0].version);
    
    // Get database file size
    const pragma = await prisma.$queryRaw`PRAGMA database_list`;
    console.log('Database file:', pragma[0].file);
    
    // List all tables
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
    `;
    console.log('Tables:', tables.map(t => t.name).join(', '));
    
  } catch (error) {
    console.error('Error getting database info:', error.message);
  }
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabase()
    .then(() => checkDatabaseInfo())
    .catch(console.error);
}

export { testDatabase, checkDatabaseInfo };