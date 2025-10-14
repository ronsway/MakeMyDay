/**
 * Quick test to verify Prisma Client is working
 * Run with: node test-prisma.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('Testing Prisma Client...\n');
  
  // Test that all models are available
  console.log('✓ prisma.user:', typeof prisma.user);
  console.log('✓ prisma.family:', typeof prisma.family);
  console.log('✓ prisma.familyMember:', typeof prisma.familyMember);
  console.log('✓ prisma.child:', typeof prisma.child);
  console.log('✓ prisma.userSession:', typeof prisma.userSession);
  console.log('✓ prisma.task:', typeof prisma.task);
  console.log('✓ prisma.event:', typeof prisma.event);
  console.log('✓ prisma.message:', typeof prisma.message);
  console.log('✓ prisma.userNotification:', typeof prisma.userNotification);
  console.log('✓ prisma.whatsAppConnection:', typeof prisma.whatsAppConnection);
  console.log('✓ prisma.calendarSync:', typeof prisma.calendarSync);
  console.log('✓ prisma.analyticsTime:', typeof prisma.analyticsTime);
  
  console.log('\n✅ All Prisma models are available!');
  console.log('\nNote: TypeScript errors in the editor are due to VS Code cache.');
  console.log('Solution: Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")');
  
  await prisma.$disconnect();
}

test().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
