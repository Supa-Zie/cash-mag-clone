import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { prisma } from './config/database';
import { authMiddleware } from './middleware/auth';
import { idempotencyMiddleware } from './utils/idempotency';
import { cleanupExpiredKeys } from './utils/idempotency';
import * as paymentController from './controllers/paymentController';

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed',
    });
  }
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { store: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password (in production, use bcrypt)
    // For demo, we'll skip actual password verification
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const jwt = await import('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, role: user.role, storeId: user.storeId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        storeId: user.storeId,
        storeName: user.store.name,
      },
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PAYMENT ROUTES (with idempotency)
// ============================================

app.post(
  '/api/payments',
  authMiddleware,
  idempotencyMiddleware('/api/payments'),
  paymentController.processPayment
);

app.get('/api/payments/:id', authMiddleware, paymentController.getPayment);

app.post(
  '/api/payments/:id/refund',
  authMiddleware,
  idempotencyMiddleware('/api/payments/:id/refund'),
  paymentController.refundPayment
);

app.get('/api/payments/circuit-status', authMiddleware, paymentController.getCircuitStatus);

// ============================================
// PRODUCTS ROUTES
// ============================================

app.get('/api/products', authMiddleware, async (req: any, res) => {
  try {
    const storeId = req.user.storeId;
    const products = await prisma.product.findMany({
      where: { storeId, isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', authMiddleware, async (req: any, res) => {
  try {
    const storeId = req.user.storeId;
    const product = await prisma.product.create({
      data: { ...req.body, storeId },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        entity: 'Product',
        entityId: product.id,
        newValue: product,
        ipAddress: req.ip,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// TRANSACTIONS ROUTES
// ============================================

app.get('/api/transactions', authMiddleware, async (req: any, res) => {
  try {
    const storeId = req.user.storeId;
    const transactions = await prisma.transaction.findMany({
      where: { storeId },
      include: {
        items: { include: { product: true } },
        payments: true,
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', authMiddleware, async (req: any, res) => {
  try {
    const { items, cashRegisterId, ...data } = req.body;
    const userId = req.user.id;
    const storeId = req.user.storeId;

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId,
        storeId,
        cashRegisterId,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE',
        entity: 'Transaction',
        entityId: transaction.id,
        newValue: transaction,
        ipAddress: req.ip,
      },
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// USERS ROUTES
// ============================================

app.get('/api/users', authMiddleware, async (req: any, res) => {
  try {
    const storeId = req.user.storeId;
    const users = await prisma.user.findMany({
      where: { storeId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================

async function start() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');

    // Start server
    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
    });

    // Schedule idempotency key cleanup (daily)
    setInterval(async () => {
      await cleanupExpiredKeys();
    }, 24 * 60 * 60 * 1000);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

start();

export default app;
