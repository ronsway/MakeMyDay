/**
 * Authentication Service for ParentFlow
 * Handles user registration, login, JWT tokens, and password management
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';
const SALT_ROUNDS = 10;

// Validation Schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

interface TokenPayload {
  userId: string;
  email: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Register a new user
 */
export async function registerUser(input: RegisterInput) {
  // Validate input
  const validated = RegisterSchema.parse(input);
  
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: { email: validated.email.toLowerCase() },
  });
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(validated.password, SALT_ROUNDS);
  
  // Generate verification token
  const verifyToken = crypto.randomBytes(32).toString('hex');
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email: validated.email.toLowerCase(),
      passwordHash,
      name: validated.name,
      phone: validated.phone,
      verifyToken,
      verified: false,
    },
  });
  
  // Create default family for user
  const family = await prisma.family.create({
    data: {
      name: `${validated.name}'s Family`,
      members: {
        create: {
          userId: user.id,
          role: 'admin',
        },
      },
    },
  });
  
  // Generate tokens
  const tokens = await generateTokens(user.id, user.email!);
  
  return {
    user: {
      id: user.id,
      email: user.email!,
      name: user.name!,
      verified: user.verified,
    },
    tokens,
    verifyToken, // Send this via email
  };
}

/**
 * Login user
 */
export async function loginUser(input: LoginInput, userAgent?: string, ipAddress?: string) {
  // Validate input
  const validated = LoginSchema.parse(input);
  
  // Find user
  const user = await prisma.user.findFirst({
    where: { email: validated.email.toLowerCase() },
  });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Verify password
  const validPassword = await bcrypt.compare(validated.password, user.passwordHash);
  
  if (!validPassword) {
    throw new Error('Invalid email or password');
  }
  
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  
  // Generate tokens
  const tokens = await generateTokens(user.id, user.email!, userAgent, ipAddress);
  
  return {
    user: {
      id: user.id,
      email: user.email!,
      name: user.name!,
      verified: user.verified,
      avatar: user.avatar,
      locale: user.locale,
      timezone: user.timezone,
    },
    tokens,
  };
}

/**
 * Generate access and refresh tokens
 */
async function generateTokens(
  userId: string, 
  email: string,
  userAgent?: string,
  ipAddress?: string
): Promise<AuthTokens> {
  const payload: TokenPayload = { userId, email };
  
  // Generate access token
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  
  // Generate refresh token
  const refreshToken = crypto.randomBytes(64).toString('hex');
  
  // Store session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
  
  await prisma.userSession.create({
    data: {
      userId,
      token: accessToken,
      refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    },
  });
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // Check if session exists and is valid
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    
    if (!session) {
      throw new Error('Invalid or expired session');
    }
    
    // Update last used
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  // Find session
  const session = await prisma.userSession.findUnique({
    where: { refreshToken },
    include: { user: true },
  });
  
  if (!session || session.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }
  
  // Generate new tokens
  const newTokens = await generateTokens(
    session.user.id,
    session.user.email!,
    session.userAgent || undefined,
    session.ipAddress || undefined
  );
  
  // Delete old session
  await prisma.userSession.delete({
    where: { id: session.id },
  });
  
  return newTokens;
}

/**
 * Logout user
 */
export async function logoutUser(token: string) {
  await prisma.userSession.deleteMany({
    where: { token },
  });
}

/**
 * Verify email
 */
export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });
  
  if (!user) {
    throw new Error('Invalid verification token');
  }
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verifyToken: null,
    },
  });
  
  return {
    message: 'Email verified successfully',
    user: {
      id: user.id,
      email: user.email!,
      verified: true,
    },
  };
}

/**
 * Initiate password reset
 */
export async function forgotPassword(email: string) {
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase() },
  });
  
  if (!user) {
    // Don't reveal if user exists
    return { message: 'If the email exists, a reset link has been sent' };
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date();
  resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetExpires,
    },
  });
  
  return {
    message: 'If the email exists, a reset link has been sent',
    resetToken, // Send this via email
  };
}

/**
 * Reset password
 */
export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetExpires: {
        gt: new Date(),
      },
    },
  });
  
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }
  
  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetExpires: null,
    },
  });
  
  // Invalidate all sessions
  await prisma.userSession.deleteMany({
    where: { userId: user.id },
  });
  
  return {
    message: 'Password reset successfully',
  };
}

/**
 * Change password (authenticated user)
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verify current password
  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  
  if (!validPassword) {
    throw new Error('Current password is incorrect');
  }
  
  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
  
  return {
    message: 'Password changed successfully',
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      verified: true,
      locale: true,
      timezone: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    phone?: string;
    avatar?: string;
    locale?: string;
    timezone?: string;
  }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      locale: true,
      timezone: true,
    },
  });
  
  return user;
}

/**
 * Clean up expired sessions (run periodically)
 */
export async function cleanupExpiredSessions() {
  const result = await prisma.userSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  
  return {
    deleted: result.count,
  };
}
