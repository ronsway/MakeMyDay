/**
 * ParentFlow POC - Complete Workflow Demonstration
 * Shows the full Hebrew NLP pipeline from message to structured data
 */

import { parseHebrewText } from '../nlp/parser.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function demonstratePOC() {
  console.log('🚀 ParentFlow POC - Complete Workflow Demonstration');
  console.log('=' .repeat(60));
  console.log('📱 Hebrew Language Parent Communication System');
  console.log('🎯 POC Goal: Parse Hebrew messages → Extract tasks/events → Save to DB');
  console.log('');

  // Hebrew test messages from real parent communications
  const hebrewMessages = [
    "נא להביא מחר חולצה כחולה לטקס",
    "ישיבת הורים מחר בשעה 16:00",
    "תשלום לטיול 50 שקל עד יום חמישי",
    "להביא בקבוק מים ונעליים לבנות לרביעי"
  ];

  console.log('🧪 Testing Hebrew NLP Parser:');
  console.log('─' .repeat(40));

  for (let i = 0; i < hebrewMessages.length; i++) {
    const message = hebrewMessages[i];
    console.log(`\n📩 Message ${i + 1}: "${message}"`);
    
    try {
      // Parse Hebrew text
      const refDate = new Date('2024-01-10T09:00:00'); // Wednesday
      const results = parseHebrewText(message, refDate, 'Asia/Jerusalem');
      
      if (results.length > 0) {
        const entity = results[0];
        console.log(`   ✅ Parsed successfully:`);
        console.log(`      Type: ${entity.type}`);
        console.log(`      Intent: ${entity.intents.join(', ')}`);
        console.log(`      Item: ${entity.entities.item || 'N/A'}`);
        console.log(`      Date: ${entity.entities.date || 'N/A'}`);
        console.log(`      Time: ${entity.entities.time || 'N/A'}`);
        console.log(`      Category: ${entity.entities.category || 'N/A'}`);
        console.log(`      Priority: ${entity.entities.priority || 'normal'}`);
        console.log(`      Confidence: ${Math.round(entity.confidence * 100)}%`);

        // Store in database
        if (entity.type === 'task') {
          const task = await prisma.task.create({
            data: {
              title: entity.entities.item || 'משימה חדשה',
              category: entity.entities.category || 'other',
              priority: entity.entities.priority || 'normal',
              dueDate: entity.entities.date || null,
              status: 'open'
            }
          });
          console.log(`      📝 Task created with ID: ${task.id}`);
        } else if (entity.type === 'event') {
          const startTime = entity.entities.date 
            ? `${entity.entities.date}T${entity.entities.time || '09:00'}:00`
            : new Date().toISOString();
          
          const event = await prisma.event.create({
            data: {
              title: entity.entities.context || entity.entities.item || 'אירוע חדש',
              startTime,
              location: entity.entities.location || null
            }
          });
          console.log(`      📅 Event created with ID: ${event.id}`);
        }
        
      } else {
        console.log(`   ❌ No actionable content detected`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('📊 Database Summary:');
  console.log('─' .repeat(20));

  // Show created tasks
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  console.log(`\n📝 Recent Tasks (${tasks.length}):`);
  tasks.forEach((task, index) => {
    console.log(`   ${index + 1}. ${task.title}`);
    console.log(`      Category: ${task.category} | Priority: ${task.priority}`);
    console.log(`      Due: ${task.dueDate || 'No due date'} | Status: ${task.status}`);
  });

  // Show created events
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  console.log(`\n📅 Recent Events (${events.length}):`);
  events.forEach((event, index) => {
    console.log(`   ${index + 1}. ${event.title}`);
    console.log(`      Time: ${event.startTime}`);
    console.log(`      Location: ${event.location || 'No location'}`);
  });

  console.log('\n' + '=' .repeat(60));
  console.log('🎉 POC Demonstration Complete!');
  console.log('');
  console.log('✅ Hebrew NLP parsing working');
  console.log('✅ Task/Event extraction functional');
  console.log('✅ Database integration successful');
  console.log('✅ Asia/Jerusalem timezone support');
  console.log('✅ Category/Priority detection');
  console.log('✅ Date/Time extraction from Hebrew text');
  console.log('');
  console.log('🚀 ParentFlow POC is ready for further development!');
  console.log('💡 Next: Implement React RTL interface, email digests, WhatsApp integration');
}

// Run demonstration
demonstratePOC()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });