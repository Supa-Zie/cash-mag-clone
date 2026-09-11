import { config } from '../config/env';

/**
 * Jitter Types
 */
export enum JitterType {
  NONE = 'none',           // No jitter (fixed delay)
  FULL = 'full',           // Random between 0 and delay
  DECORRELATED = 'decorrelated', // Random between base and 3x previous
  EQUAL = 'equal'          // Random between delay/2 and delay
}

/**
 * Calculate delay with jitter
 * 
 * Jitter prevents "thundering herd" problem where multiple clients
 * retry simultaneously and overwhelm a recovering service.
 */
export function calculateJitter(
  attempt: number,
  baseDelay: number = config.retryBaseDelay,
  maxDelay: number = 30000,
  jitterType: JitterType = JitterType.FULL
): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  
  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, maxDelay);

  switch (jitterType) {
    case JitterType.NONE:
      return cappedDelay;

    case JitterType.FULL:
      // Random value between 0 and cappedDelay
      return Math.random() * cappedDelay;

    case JitterType.EQUAL:
      // Random value between cappedDelay/2 and cappedDelay
      return cappedDelay / 2 + Math.random() * (cappedDelay / 2);

    case JitterType.DECORRELATED:
      // Random value between baseDelay and 3 * previous delay
      // This is more aggressive and works well for distributed systems
      const previousDelay = attempt === 0 ? baseDelay : calculateJitter(attempt - 1, baseDelay, maxDelay, jitterType);
      return Math.min(baseDelay + Math.random() * (previousDelay * 3 - baseDelay), maxDelay);

    default:
      return cappedDelay;
  }
}

/**
 * Sleep with jitter
 */
export async function sleepWithJitter(
  attempt: number,
  baseDelay?: number,
  maxDelay?: number,
  jitterType?: JitterType
): Promise<void> {
  const delay = calculateJitter(attempt, baseDelay, maxDelay, jitterType);
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Retry with exponential backoff and jitter
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    jitterType?: JitterType;
    onRetry?: (attempt: number, error: Error, delay: number) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = config.retryMaxAttempts,
    baseDelay = config.retryBaseDelay,
    maxDelay = 30000,
    jitterType = JitterType.FULL,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts - 1) {
        const delay = calculateJitter(attempt, baseDelay, maxDelay, jitterType);
        
        if (onRetry) {
          onRetry(attempt + 1, lastError, delay);
        }

        console.log(`[Retry] Attempt ${attempt + 1}/${maxAttempts} failed. Retrying in ${delay}ms...`);
        await sleepWithJitter(attempt, baseDelay, maxDelay, jitterType);
      }
    }
  }

  throw lastError!;
}

/**
 * Example usage:
 * 
 * // Simple retry
 * const result = await retryWithJitter(() => fetchExternalAPI());
 * 
 * // With custom options
 * const result = await retryWithJitter(
 *   () => processPayment(data),
 *   {
 *     maxAttempts: 5,
 *     baseDelay: 500,
 *     maxDelay: 10000,
 *     jitterType: JitterType.DECORRELATED,
 *     onRetry: (attempt, error, delay) => {
 *       logger.warn(`Payment attempt ${attempt} failed: ${error.message}`);
 *     }
 *   }
 * );
 */
