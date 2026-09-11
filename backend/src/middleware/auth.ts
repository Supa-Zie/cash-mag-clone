import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { prisma } from '../config/database';

/**
 * Extended Request interface with user data
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    storeId: string;
  };
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        storeId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'User not found or inactive' });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
    };

    // Set PostgreSQL session variables for RLS
    await prisma.$executeRawUnsafe(
      `SELECT set_config('app.current_user_id', $1, true)`,
      user.id
    );
    await prisma.$executeRawUnsafe(
      `SELECT set_config('app.current_store_id', $1, true)`,
      user.storeId
    );
    await prisma.$executeRawUnsafe(
      `SELECT set_config('app.current_user_role', $1, true)`,
      user.role
    );

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Role-based access control middleware
 * Restricts access based on user role
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Store access middleware
 * Ensures user can only access their own store's data
 */
export function requireStoreAccess(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const requestedStoreId = req.params.storeId || req.body.storeId || req.query.storeId;

  if (requestedStoreId && requestedStoreId !== req.user.storeId) {
    res.status(403).json({ error: 'Access denied to this store' });
    return;
  }

  next();
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  } as jwt.SignOptions);
}
