/**
 * Simple SQLite Database Browser
 * Run with: node browse-db.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function browseDatabase() {
  console.log('🔍 SQLite Database Browser\n');

  try {
    await prisma.$connect();
    
    // Show database stats
    console.log('📊 Database Statistics:');
    
    const models = [
      { name: 'Users', model: prisma.user },
      { name: 'Families', model: prisma.family },
      { name: 'Children', model: prisma.child },
      { name: 'Tasks', model: prisma.task },
      { name: 'Events', model: prisma.event },
      { name: 'Messages', model: prisma.message },
      { name: 'Sessions', model: prisma.userSession },
    ];

    for (const { name, model } of models) {
      try {
        const count = await model.count();
        console.log(`   ${name}: ${count} records`);
      } catch (error) {
        console.log(`   ${name}: Error counting (${error.message})`);
      }
    }

    // Show sample data if any exists
    console.log('\n📄 Sample Data:');
    
    const sampleUser = await prisma.user.findFirst();
    if (sampleUser) {
      console.log('Sample User:', {
        name: sampleUser.name,
        email: sampleUser.email,
        locale: sampleUser.locale,
      });
    }

    const sampleChild = await prisma.child.findFirst();
    if (sampleChild) {
      console.log('Sample Child:', {
        name: sampleChild.name,
        grade: sampleChild.grade,
        school: sampleChild.school,
      });
    }

    const sampleTask = await prisma.task.findFirst();
    if (sampleTask) {
      console.log('Sample Task:', {
        title: sampleTask.title,
        status: sampleTask.status,
        priority: sampleTask.priority,
      });
    }

  } catch (error) {
    console.error('❌ Error browsing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

browseDatabase();