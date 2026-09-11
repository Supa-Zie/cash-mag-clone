import { prisma } from '../config/database';
import { config } from '../config/env';
import { createHash } from 'crypto';

/**
 * Idempotency Key Handler
 * 
 * Prevents duplicate operations (especially payments) by:
 * 1. Checking if request with same key was already processed
 * 2. Returning cached response if found
 * 3. Storing new response after successful processing
 * 4. Auto-expiring old keys to prevent storage bloat
 */

interface IdempotencyRecord {
  id: string;
  key: string;
  endpoint: string;
  userId: string;
  requestHash: string;
  responseStatus: number | null;
  responseBody: any | null;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Hash request body for validation
 * Ensures same idempotency key isn't used with different payloads
 */
function hashRequestBody(body: any): string {
  const normalized = JSON.stringify(body, Object.keys(body).sort());
  return createHash('sha256').update(normalized).digest('hex');
}

/**
 * Check if idempotency key exists and return cached response
 */
export async function checkIdempotencyKey(
  key: string,
  endpoint: string,
  userId: string,
  requestBody: any
): Promise<{ exists: boolean; response?: any; conflict?: boolean }> {
  const record = await prisma.idempotencyKey.findUnique({
    where: { key },
  });

  if (!record) {
    return { exists: false };
  }

  // Check if expired
  if (record.expiresAt < new Date()) {
    // Clean up expired record
    await prisma.idempotencyKey.delete({ where: { id: record.id } });
    return { exists: false };
  }

  // Validate request hash matches
  const requestHash = hashRequestBody(requestBody);
  if (record.requestHash !== requestHash) {
    return { exists: true, conflict: true };
  }

  // Return cached response if available
  if (record.responseStatus && record.responseBody) {
    return {
      exists: true,
      response: {
        status: record.responseStatus,
        body: record.responseBody,
      },
    };
  }

  // Request is in progress (no response yet)
  return { exists: true, response: null };
}

/**
 * Create new idempotency key record
 */
export async function createIdempotencyKey(
  key: string,
  endpoint: string,
  userId: string,
  requestBody: any
): Promise<void> {
  const expiresAt = new Date(Date.now() + config.idempotencyKeyExpiry);
  const requestHash = hashRequestBody(requestBody);

  await prisma.idempotencyKey.create({
    data: {
      key,
      endpoint,
      userId,
      requestHash,
      expiresAt,
    },
  });
}

/**
 * Store response for idempotency key
 */
export async function storeIdempotencyResponse(
  key: string,
  status: number,
  body: any
): Promise<void> {
  await prisma.idempotencyKey.update({
    where: { key },
    data: {
      responseStatus: status,
      responseBody: body,
    },
  });
}

/**
 * Clean up expired idempotency keys
 * Should be run periodically (e.g., daily cron job)
 */
export async function cleanupExpiredKeys(): Promise<number> {
  const result = await prisma.idempotencyKey.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  console.log(`[Idempotency] Cleaned up ${result.count} expired keys`);
  return result.count;
}

/**
 * Middleware for handling idempotency
 */
export function idempotencyMiddleware(endpoint: string) {
  return async (req: any, res: any, next: any) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
      return next();
    }

    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required for idempotency' });
      }

      const result = await checkIdempotencyKey(
        idempotencyKey,
        endpoint,
        userId,
        req.body
      );

      if (result.conflict) {
        return res.status(409).json({
          error: 'Idempotency key conflict',
          message: 'Same idempotency key used with different request body',
        });
      }

      if (result.exists && result.response) {
        // Return cached response
        console.log(`[Idempotency] Returning cached response for key: ${idempotencyKey}`);
        return res.status(result.response.status).json(result.response.body);
      }

      if (result.exists && !result.response) {
        // Request is in progress
        return res.status(409).json({
          error: 'Request in progress',
          message: 'A request with this idempotency key is already being processed',
        });
      }

      // Create new idempotency key
      await createIdempotencyKey(idempotencyKey, endpoint, userId, req.body);

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json to capture response
      res.json = (body: any) => {
        storeIdempotencyResponse(idempotencyKey, res.statusCode, body).catch(err => {
          console.error('[Idempotency] Failed to store response:', err);
        });
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('[Idempotency] Error:', error);
      next(error);
    }
  };
}

/**
 * Example usage:
 * 
 * // In payment route
 * app.post('/api/payments', 
 *   authMiddleware,
 *   idempotencyMiddleware('/api/payments'),
 *   paymentController.processPayment
 * );
 * 
 * // Client request
 * fetch('/api/payments', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Idempotency-Key': 'unique-key-123',
 *     'Authorization': 'Bearer token'
 *   },
 *   body: JSON.stringify({ amount: 100, currency: 'CHF' })
 * });
 */
