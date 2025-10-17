/**
 * ParentFlow POC - Fastify API Server
 * Locale: he-IL | TZ: Asia/Jerusalem | RTL UI
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { parseHebrewText } from '../nlp/parser.js';
import { 
  VERSION_CONFIG, 
  getVersionInfo, 
  isVersionSupported, 
  isFeatureEnabled,
  compareVersions,
  type ApiVersion 
} from './version.js';
import {
  registerUser,
  loginUser,
  verifyToken,
  refreshAccessToken,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserById,
  updateUserProfile,
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema
} from './auth.js';

const app = Fastify({ logger: true });
const prisma = new PrismaClient();
const TIMEZONE = 'Asia/Jerusalem';

// Register CORS
await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Input validation schemas
const IngestRequestSchema = z.object({
  messageContent: z.string().min(1).max(1000),
  source: z.enum(['whatsapp', 'email', 'sms']).default('whatsapp')
});

// Version middleware to check client compatibility
app.addHook('preHandler', async (request, reply) => {
  const clientVersion = request.headers['x-client-version'] as string;
  const apiVersion = request.headers['x-api-version'] as string || 'v1';
  
  // Skip version checks for health and version endpoints
  if (request.url === '/health' || request.url === '/version' || request.url.startsWith('/api/version')) {
    return;
  }
  
  // Check API version support
  if (!VERSION_CONFIG.api.supported.includes(apiVersion as ApiVersion)) {
    reply.code(400);
    return {
      error: 'Unsupported API version',
      supportedVersions: VERSION_CONFIG.api.supported,
      requestedVersion: apiVersion
    };
  }
  
  // Check client version compatibility
  if (clientVersion && !isVersionSupported(clientVersion)) {
    reply.code(426); // Upgrade Required
    return {
      error: 'Client version not supported',
      minimumVersion: VERSION_CONFIG.client.minimumVersion,
      currentVersion: clientVersion,
      updateRequired: true
    };
  }
  
  // Add version info to request context
  request.versionContext = {
    clientVersion: clientVersion || 'unknown',
    apiVersion: apiVersion as ApiVersion,
    featuresEnabled: Object.fromEntries(
      Object.keys(VERSION_CONFIG.features).map(feature => [
        feature,
        isFeatureEnabled(feature as any, clientVersion)
      ])
    )
  };
});

// Extend Fastify request type for version context
declare module 'fastify' {
  interface FastifyRequest {
    versionContext?: {
      clientVersion: string;
      apiVersion: ApiVersion;
      featuresEnabled: Record<string, boolean>;
    };
  }
}

// Health check endpoint
app.get('/health', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { 
      status: 'healthy',
      timezone: TIMEZONE,
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: VERSION_CONFIG.app.version,
      apiVersion: VERSION_CONFIG.api.current
    };
  } catch (error) {
    reply.code(503);
    return { 
      status: 'unhealthy',
      error: 'Database connection failed',
      version: VERSION_CONFIG.app.version
    };
  }
});

// Version information endpoint
app.get('/version', async (request, reply) => {
  return getVersionInfo();
});

// API version endpoint (with detailed feature info)
app.get('/api/version', async (request, reply) => {
  const clientVersion = request.headers['x-client-version'] as string;
  
  return {
    ...getVersionInfo(),
    clientSupported: clientVersion ? isVersionSupported(clientVersion) : null,
    features: Object.fromEntries(
      Object.entries(VERSION_CONFIG.features).map(([key, feature]) => [
        key,
        {
          enabled: feature.enabled,
          minVersion: feature.minVersion,
          available: clientVersion ? isFeatureEnabled(key as any, clientVersion) : feature.enabled
        }
      ])
    ),
    deprecations: VERSION_CONFIG.deprecations
  };
});

// Message ingestion endpoint
app.post('/api/ingest', async (request, reply) => {
  try {
    const validation = IngestRequestSchema.safeParse(request.body);
    if (!validation.success) {
      reply.code(400);
      return { 
        error: 'Invalid request data',
        details: validation.error.issues
      };
    }

    const { messageContent, source } = validation.data;
    const now = new Date();
    
    // Parse Hebrew text
    const parsedEntities = parseHebrewText(messageContent, now, TIMEZONE);
    
    if (parsedEntities.length === 0) {
      reply.code(400);
      return { 
        error: 'No actionable content detected in message'
      };
    }

    // Store original message
    const message = await prisma.message.create({
      data: {
        source,
        rawText: messageContent,
        parsed: JSON.stringify(parsedEntities),
        ts: now.toISOString(),
        hash: Buffer.from(messageContent).toString('base64').slice(0, 32)
      }
    });

    const results = [];

    // Process each parsed entity
    for (const entity of parsedEntities) {
      if (entity.type === 'task') {
        const task = await createTask(entity, message.id);
        results.push({ type: 'task', id: task.id, data: task });
      } else if (entity.type === 'event') {
        const event = await createEvent(entity, message.id);
        results.push({ type: 'event', id: event.id, data: event });
      }
    }

    return {
      messageId: message.id,
      entitiesProcessed: parsedEntities.length,
      results,
      timezone: TIMEZONE,
      version: VERSION_CONFIG.app.version,
      apiVersion: request.versionContext?.apiVersion || 'v1'
    };

  } catch (error) {
    app.log.error(`Ingestion error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(500);
    return { error: 'Internal server error' };
  }
});

// Get tasks endpoint
app.get('/api/tasks', async (request, reply) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: today
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return {
      tasks,
      count: tasks.length,
      timezone: TIMEZONE,
      version: VERSION_CONFIG.app.version,
      apiVersion: request.versionContext?.apiVersion || 'v1'
    };

  } catch (error) {
    app.log.error(`Tasks query error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(500);
    return { error: 'Internal server error' };
  }
});

// Get events endpoint
app.get('/api/events', async (request, reply) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const events = await prisma.event.findMany({
      where: {
        startTime: {
          startsWith: today
        }
      },
      orderBy: { startTime: 'asc' }
    });

    return {
      events,
      count: events.length,
      timezone: TIMEZONE,
      version: VERSION_CONFIG.app.version,
      apiVersion: request.versionContext?.apiVersion || 'v1'
    };

  } catch (error) {
    app.log.error(`Events query error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(500);
    return { error: 'Internal server error' };
  }
});

// Mark task as completed
app.put('/api/tasks/:id/complete', async (request, reply) => {
  try {
    const taskId = (request.params as { id: string }).id;
    
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: 'done' }
    });

    return {
      id: task.id,
      status: task.status,
      timezone: TIMEZONE,
      version: VERSION_CONFIG.app.version,
      apiVersion: request.versionContext?.apiVersion || 'v1'
    };

  } catch (error) {
    if ((error as any)?.code === 'P2025') {
      reply.code(404);
      return { error: 'Task not found' };
    }
    
    app.log.error(`Task completion error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(500);
    return { error: 'Internal server error' };
  }
});

// Get analytics data
app.get('/api/analytics', async (request, reply) => {
  try {
    const analytics = await prisma.analyticsTime.findMany({
      orderBy: { period: 'desc' },
      take: 30
    });

    const totalMinutesSaved = analytics.reduce((sum, record) => sum + record.timeSavedMinutes, 0);
    const averageDaily = analytics.length > 0 ? totalMinutesSaved / analytics.length : 0;

    return {
      totalMinutesSaved,
      averageDailyMinutes: Math.round(averageDaily),
      recentData: analytics,
      timezone: TIMEZONE,
      version: VERSION_CONFIG.app.version,
      apiVersion: request.versionContext?.apiVersion || 'v1'
    };

  } catch (error) {
    app.log.error(`Analytics query error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(500);
    return { error: 'Internal server error' };
  }
});

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Register new user
app.post('/api/auth/register', async (request, reply) => {
  try {
    const result = await registerUser(request.body as any);
    reply.code(201);
    return result;
  } catch (error) {
    app.log.error(`Registration error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(400);
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }
});

// User login
app.post('/api/auth/login', async (request, reply) => {
  try {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;
    
    const result = await loginUser(request.body as any, userAgent, ipAddress);
    return result;
  } catch (error) {
    app.log.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(401);
    return { error: error instanceof Error ? error.message : 'Login failed' };
  }
});

// Refresh access token
app.post('/api/auth/refresh', async (request, reply) => {
  try {
    const { refreshToken } = request.body as { refreshToken: string };
    const result = await refreshAccessToken(refreshToken);
    return result;
  } catch (error) {
    app.log.error(`Token refresh error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(401);
    return { error: 'Invalid or expired refresh token' };
  }
});

// Logout user
app.post('/api/auth/logout', async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401);
      return { error: 'No token provided' };
    }
    
    await logoutUser(token);
    return { message: 'Logged out successfully' };
  } catch (error) {
    app.log.error(`Logout error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(500);
    return { error: 'Logout failed' };
  }
});

// Get current user profile
app.get('/api/auth/me', async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401);
      return { error: 'No token provided' };
    }
    
    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);
    return user;
  } catch (error) {
    app.log.error(`Get user error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(401);
    return { error: 'Unauthorized' };
  }
});

// Update user profile
app.put('/api/auth/profile', async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401);
      return { error: 'No token provided' };
    }
    
    const decoded = await verifyToken(token);
    const user = await updateUserProfile(decoded.userId, request.body as any);
    return user;
  } catch (error) {
    app.log.error(`Update profile error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(400);
    return { error: error instanceof Error ? error.message : 'Update failed' };
  }
});

// Verify email
app.post('/api/auth/verify-email', async (request, reply) => {
  try {
    const { token } = request.body as { token: string };
    const result = await verifyEmail(token);
    return result;
  } catch (error) {
    app.log.error(`Email verification error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(400);
    return { error: error instanceof Error ? error.message : 'Verification failed' };
  }
});

// Forgot password
app.post('/api/auth/forgot-password', async (request, reply) => {
  try {
    const { email } = request.body as { email: string };
    const result = await forgotPassword(email);
    return result;
  } catch (error) {
    app.log.error(`Forgot password error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(500);
    return { error: 'Request failed' };
  }
});

// Reset password
app.post('/api/auth/reset-password', async (request, reply) => {
  try {
    const { token, password } = request.body as { token: string; password: string };
    const result = await resetPassword(token, password);
    return result;
  } catch (error) {
    app.log.error(`Password reset error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(400);
    return { error: error instanceof Error ? error.message : 'Reset failed' };
  }
});

// Change password (authenticated)
app.post('/api/auth/change-password', async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401);
      return { error: 'No token provided' };
    }
    
    const decoded = await verifyToken(token);
    const { currentPassword, newPassword } = request.body as { currentPassword: string; newPassword: string };
    const result = await changePassword(decoded.userId, currentPassword, newPassword);
    return result;
  } catch (error) {
    app.log.error(`Change password error: ${error instanceof Error ? error.message : String(error)}`);
    reply.code(400);
    return { error: error instanceof Error ? error.message : 'Password change failed' };
  }
});

// Helper functions
function calculateTimeSaved(tasksCount: number, eventsCount: number): number {
  // Estimate time saved based on automation
  // Each task saves ~2-3 minutes of manual planning
  // Each event saves ~1-2 minutes of calendar entry
  const taskTimeSaving = tasksCount * 2.5;
  const eventTimeSaving = eventsCount * 1.5;
  return Math.round(taskTimeSaving + eventTimeSaving);
}

async function createTask(entity: any, messageId: string) {
  // TODO: Get userId from authenticated request once auth is integrated
  // For now, we'll need to create a default/system user or make userId optional
  return await prisma.task.create({
    data: {
      userId: 'system', // Temporary: will be replaced with actual user ID
      title: entity.entities.item || 'משימה חדשה',
      category: entity.entities.category || 'other',
      priority: entity.entities.priority || 'normal',
      dueDate: entity.entities.date || null,
      messageId,
      status: 'open'
    }
  });
}

async function createEvent(entity: any, messageId: string) {
  const startTime = entity.entities.date 
    ? `${entity.entities.date}T${entity.entities.time || '09:00'}:00`
    : new Date().toISOString();

  // TODO: Get userId from authenticated request once auth is integrated
  return await prisma.event.create({
    data: {
      userId: 'system', // Temporary: will be replaced with actual user ID
      title: entity.entities.context || 'אירוע חדש',
      startTime,
      location: entity.entities.location || null
    }
  });
}

// Start server
const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 ParentFlow POC API Server running on port 3001');
    console.log(`🌍 Timezone: ${TIMEZONE}`);
    console.log('📡 Health check: http://localhost:3001/health');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down ParentFlow API Server...');
  await prisma.$disconnect();
  process.exit(0);
});

start();