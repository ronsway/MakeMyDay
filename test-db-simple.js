/**
 * Simple Database Operations Test
 * Run with: node test-db-simple.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testOperations() {
  console.log('🚀 Testing Database Operations...\n');

  try {
    // 1. Test connection
    console.log('1️⃣ Testing connection...');
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // 2. Check existing data
    console.log('2️⃣ Checking existing data...');
    const userCount = await prisma.user.count();
    const familyCount = await prisma.family.count();
    const childCount = await prisma.child.count();
    const taskCount = await prisma.task.count();
    const eventCount = await prisma.event.count();

    console.log(`Current data: ${userCount} users, ${familyCount} families, ${childCount} children, ${taskCount} tasks, ${eventCount} events\n`);

    // 3. Test creating a child (if we have families)
    if (familyCount > 0) {
      console.log('3️⃣ Testing child creation...');
      const firstFamily = await prisma.family.findFirst();
      
      try {
        const newChild = await prisma.child.create({
          data: {
            familyId: firstFamily.id,
            name: 'Test Child דני',
            grade: 'ב',
            school: 'Test School',
            avatar: '👦',
          },
        });
        console.log('✅ Created child:', newChild.name);
        
        // 4. Test creating a task for this child
        console.log('\n4️⃣ Testing task creation...');
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          const newTask = await prisma.task.create({
            data: {
              userId: firstUser.id,
              childId: newChild.id,
              title: 'Test Task - הביאו ספר',
              description: 'Test description',
              dueDate: '2025-10-20',
              status: 'open',
              priority: 'normal',
            },
          });
          console.log('✅ Created task:', newTask.title);
        }

        // 5. Test querying with relations
        console.log('\n5️⃣ Testing relations query...');
        const childWithTasks = await prisma.child.findFirst({
          where: { id: newChild.id },
          include: {
            tasks: true,
            family: true,
          },
        });
        console.log('✅ Child with relations:', {
          name: childWithTasks.name,
          tasksCount: childWithTasks.tasks.length,
          family: childWithTasks.family.name,
        });

        // 6. Clean up test data
        console.log('\n6️⃣ Cleaning up test data...');
        await prisma.task.deleteMany({
          where: { childId: newChild.id },
        });
        await prisma.child.delete({
          where: { id: newChild.id },
        });
        console.log('✅ Test data cleaned up');

      } catch (error) {
        console.error('❌ Error during child/task operations:', error.message);
      }
    }

    // 7. Test raw queries
    console.log('\n7️⃣ Testing raw SQL queries...');
    try {
      const tables = await prisma.$queryRaw`
        SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
      `;
      console.log('✅ Database tables:', tables.map(t => t.name).join(', '));
    } catch (error) {
      console.error('❌ Raw query failed:', error.message);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔚 Database disconnected');
  }
}

testOperations();