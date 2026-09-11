import { config } from '../config/env';

/**
 * Circuit Breaker States
 */
export enum CircuitState {
  CLOSED = 'CLOSED',      // Normal operation
  OPEN = 'OPEN',          // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

/**
 * Circuit Breaker Configuration
 */
interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures before opening
  resetTimeout: number;        // Time in ms before attempting reset
  monitoringPeriod: number;    // Time window for counting failures
  name: string;                // Circuit name for logging
}

/**
 * Circuit Breaker Implementation
 * 
 * Prevents cascading failures by:
 * 1. Tracking consecutive failures
 * 2. Opening circuit when threshold reached
 * 3. Allowing test requests after timeout
 * 4. Closing circuit on success
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private successCount = 0;
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> & { name: string }) {
    this.config = {
      failureThreshold: config.failureThreshold ?? config.circuitBreakerThreshold ?? 5,
      resetTimeout: config.resetTimeout ?? config.circuitBreakerTimeout ?? 60000,
      monitoringPeriod: config.monitoringPeriod ?? 60000,
      name: config.name,
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        console.log(`[CircuitBreaker:${this.config.name}] Attempting reset (HALF_OPEN)`);
      } else {
        throw new Error(`Circuit breaker ${this.config.name} is OPEN`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Check if we should attempt to reset the circuit
   */
  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false;
    const timeSinceLastFailure = Date.now() - this.lastFailureTime;
    return timeSinceLastFailure >= this.config.resetTimeout;
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= 3) {
        this.reset();
        console.log(`[CircuitBreaker:${this.config.name}] Circuit CLOSED after successful tests`);
      }
    } else {
      this.failureCount = 0;
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      this.successCount = 0;
      console.log(`[CircuitBreaker:${this.config.name}] Circuit re-OPENED after failed test`);
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      console.log(`[CircuitBreaker:${this.config.name}] Circuit OPENED after ${this.failureCount} failures`);
    }
  }

  /**
   * Reset circuit to closed state
   */
  private reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
  }

  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get stats for monitoring
   */
  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

/**
 * Circuit Breaker Registry
 * Manage multiple circuit breakers for different services
 */
export class CircuitBreakerRegistry {
  private static circuits = new Map<string, CircuitBreaker>();

  static get(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.circuits.has(name)) {
      this.circuits.set(name, new CircuitBreaker({ name, ...config }));
    }
    return this.circuits.get(name)!;
  }

  static getAll() {
    return Array.from(this.circuits.entries()).map(([name, circuit]) => ({
      name,
      ...circuit.getStats(),
    }));
  }
}
