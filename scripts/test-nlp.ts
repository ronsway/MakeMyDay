/**
 * ParentFlow POC - Hebrew NLP Test Suite
 * Tests Hebrew message parsing with real-world examples
 */

import { parseHebrewText } from '../nlp/parser.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test messages in Hebrew (real parent communication examples)
const testMessages = [
  {
    text: "נא להביא מחר חולצה כחולה לטקס",
    expected: { type: 'task', category: 'equipment', priority: 'high' }
  },
  {
    text: "שיעורי בית במתמטיקה לשלישי",
    expected: { type: 'task', category: 'homework', date: true }
  },
  {
    text: "תשלום לטיול 50 שקל עד יום חמישי",
    expected: { type: 'task', category: 'payment', priority: 'high' }
  },
  {
    text: "ישיבת הורים מחר בשעה 16:00",
    expected: { type: 'event', time: '16:00', date: true }
  },
  {
    text: "להביא בקבוק מים ונעליים לבנות לחמישי",
    expected: { type: 'task', category: 'equipment', date: true }
  },
  {
    text: "פעילות חנוכה ביום רביעי בבוקר",
    expected: { type: 'event', date: true, time: true }
  },
  {
    text: "לא לשכוח מתנה למורה לסיום השנה",
    expected: { type: 'task', category: 'gift', priority: 'high' }
  },
  {
    text: "טיול לגן החיות ב-15/12 בשעה 8:30",
    expected: { type: 'event', date: true, time: true }
  }
];

async function runHebrewNLPTests() {
  console.log('🧪 ParentFlow POC - Hebrew NLP Test Suite');
  console.log('=' .repeat(50));

  const refDate = new Date('2024-01-10T09:00:00'); // Wednesday
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testMessages.length; i++) {
    const test = testMessages[i];
    console.log(`\n📝 Test ${i + 1}: "${test.text}"`);
    
    try {
      const results = parseHebrewText(test.text, refDate);
      
      if (results.length === 0) {
        console.log('❌ No entities extracted');
        failed++;
        continue;
      }

      const entity = results[0];
      console.log(`   Type: ${entity.type}`);
      console.log(`   Confidence: ${entity.confidence}`);
      console.log(`   Date: ${entity.entities.date || 'none'}`);
      console.log(`   Time: ${entity.entities.time || 'none'}`);
      console.log(`   Item: ${entity.entities.item || 'none'}`);
      console.log(`   Category: ${entity.entities.category || 'none'}`);
      console.log(`   Priority: ${entity.entities.priority || 'normal'}`);

      // Validate expectations
      let testPassed = true;
      
      if (entity.type !== test.expected.type) {
        console.log(`   ❌ Expected type: ${test.expected.type}, got: ${entity.type}`);
        testPassed = false;
      }
      
      if (test.expected.category && entity.entities.category !== test.expected.category) {
        console.log(`   ❌ Expected category: ${test.expected.category}, got: ${entity.entities.category}`);
        testPassed = false;
      }
      
      if (test.expected.priority && entity.entities.priority !== test.expected.priority) {
        console.log(`   ❌ Expected priority: ${test.expected.priority}, got: ${entity.entities.priority}`);
        testPassed = false;
      }
      
      if (test.expected.date && !entity.entities.date) {
        console.log(`   ❌ Expected date extraction, but none found`);
        testPassed = false;
      }
      
      if (test.expected.time && !entity.entities.time) {
        console.log(`   ❌ Expected time extraction, but none found`);
        testPassed = false;
      }

      if (testPassed) {
        console.log('   ✅ Test passed');
        passed++;
      } else {
        failed++;
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log(`📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}/${testMessages.length}`);
  console.log(`   ❌ Failed: ${failed}/${testMessages.length}`);
  console.log(`   📈 Success rate: ${Math.round((passed / testMessages.length) * 100)}%`);
  
  if (passed === testMessages.length) {
    console.log('\n🎉 All tests passed! Hebrew NLP is working correctly.');
  } else if (passed >= testMessages.length * 0.7) {
    console.log('\n⚠️ Most tests passed. Some fine-tuning needed.');
  } else {
    console.log('\n❌ Many tests failed. Hebrew NLP needs significant work.');
  }
}

async function testDatabaseIntegration() {
  console.log('\n🗄️ Testing database integration...');
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('   ✅ Database connection successful');

    // Test creating a sample task
    const testTask = await prisma.task.create({
      data: {
        title: 'משימת בדיקה',
        category: 'test',
        priority: 'normal',
        status: 'open',
        dueDate: '2024-01-10'
      }
    });
    console.log('   ✅ Task creation successful');

    // Clean up
    await prisma.task.delete({
      where: { id: testTask.id }
    });
    console.log('   ✅ Task cleanup successful');

  } catch (error) {
    console.log(`   ❌ Database test failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 Testing API endpoints...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3001/health');
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('   ✅ Health endpoint working');
      console.log(`      Status: ${health.status}`);
      console.log(`      Timezone: ${health.timezone}`);
    } else {
      console.log('   ❌ Health endpoint failed');
    }

  } catch (error) {
    console.log(`   ⚠️ API server not running: ${error instanceof Error ? error.message : String(error)}`);
    console.log('   💡 Start the API server with: npm run dev:api');
  }
}

// Run all tests
async function runAllTests() {
  await runHebrewNLPTests();
  await testDatabaseIntegration();
  await testAPIEndpoints();
  
  console.log('\n🏁 Test suite completed');
  await prisma.$disconnect();
}

// Allow running specific test suites
if (process.argv.includes('--nlp-only')) {
  runHebrewNLPTests().then(() => process.exit(0));
} else if (process.argv.includes('--db-only')) {
  testDatabaseIntegration().then(() => process.exit(0));
} else if (process.argv.includes('--api-only')) {
  testAPIEndpoints().then(() => process.exit(0));
} else {
  runAllTests().then(() => process.exit(0));
}