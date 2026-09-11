import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  
  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  
  // Circuit Breaker
  circuitBreakerThreshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10),
  circuitBreakerTimeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT || '60000', 10), // 1 minute
  
  // Retry
  retryMaxAttempts: parseInt(process.env.RETRY_MAX_ATTEMPTS || '3', 10),
  retryBaseDelay: parseInt(process.env.RETRY_BASE_DELAY || '1000', 10), // 1 second
  
  // Idempotency
  idempotencyKeyExpiry: parseInt(process.env.IDEMPOTENCY_KEY_EXPIRY || '86400000', 10), // 24 hours
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};
