import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { CircuitBreakerRegistry } from '../utils/circuitBreaker';
import { retryWithJitter, JitterType } from '../utils/jitter';
import { AuthRequest } from '../middleware/auth';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Payment Controller
 * 
 * Handles payment processing with:
 * - Idempotency (prevents duplicate charges)
 * - Circuit breaker (handles payment gateway failures)
 * - Retry with jitter (resilient external calls)
 * - Row-level security (users only see their store's data)
 */

// Circuit breaker for payment gateway
const paymentGatewayCircuit = CircuitBreakerRegistry.get('payment-gateway', {
  failureThreshold: 5,
  resetTimeout: 60000,
});

/**
 * Process payment
 * POST /api/payments
 */
export async function processPayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { transactionId, amount, currency = 'CHF', method } = req.body;
    const userId = req.user!.id;
    const storeId = req.user!.storeId;

    // Verify transaction exists and belongs to user's store
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        storeId,
      },
    });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    // Check if payment already exists (idempotency check)
    const existingPayment = await prisma.payment.findFirst({
      where: { transactionId },
    });

    if (existingPayment) {
      res.status(200).json({
        message: 'Payment already processed',
        payment: existingPayment,
      });
      return;
    }

    // Process payment with circuit breaker and retry
    const paymentResult = await paymentGatewayCircuit.execute(async () => {
      return await retryWithJitter(
        async () => {
          // Simulate external payment gateway call
          return await processExternalPayment({
            transactionId,
            amount: parseFloat(amount.toString()),
            currency,
            method,
          });
        },
        {
          maxAttempts: 3,
          baseDelay: 1000,
          maxDelay: 10000,
          jitterType: JitterType.FULL,
          onRetry: (attempt, error, delay) => {
            console.log(`[Payment] Retry attempt ${attempt}, delay: ${delay}ms`);
          },
        }
      );
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        transactionId,
        method,
        status: 'COMPLETED',
        amount: new Decimal(amount),
        currency,
        idempotencyKey: req.headers['idempotency-key'] as string || `pay_${Date.now()}`,
        externalRef: paymentResult.reference,
        processor: paymentResult.processor,
        processorFee: new Decimal(paymentResult.fee || 0),
        processedAt: new Date(),
      },
    });

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'COMPLETED' },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PAYMENT_PROCESSED',
        entity: 'Payment',
        entityId: payment.id,
        newValue: { amount, currency, method, reference: paymentResult.reference },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
    });
  } catch (error: any) {
    console.error('[Payment] Error:', error);

    // Check if circuit breaker is open
    if (error.message.includes('Circuit breaker')) {
      res.status(503).json({
        error: 'Payment service temporarily unavailable',
        message: 'Please try again later',
      });
      return;
    }

    res.status(500).json({
      error: 'Payment processing failed',
      message: error.message,
    });
  }
}

/**
 * Simulate external payment gateway call
 * In production, this would call Stripe, TWINT, PostFinance, etc.
 */
async function processExternalPayment(data: {
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
}): Promise<{
  success: boolean;
  reference: string;
  processor: string;
  fee: number;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  // Simulate occasional failures (5% failure rate)
  if (Math.random() < 0.05) {
    throw new Error('Payment gateway timeout');
  }

  // Simulate processor response
  const processors: Record<string, string> = {
    CASH: 'internal',
    CARD: 'stripe',
    TWINT: 'twint',
    POSTFINANCE: 'postfinance',
  };

  const processor = processors[data.method] || 'unknown';
  const fee = data.method === 'CARD' ? data.amount * 0.029 + 0.30 : 0;

  return {
    success: true,
    reference: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    processor,
    fee: parseFloat(fee.toFixed(2)),
  };
}

/**
 * Get payment by ID
 * GET /api/payments/:id
 */
export async function getPayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const storeId = req.user!.storeId;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        transaction: {
          storeId,
        },
      },
      include: {
        transaction: true,
      },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Refund payment
 * POST /api/payments/:id/refund
 */
export async function refundPayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const storeId = req.user!.storeId;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        transaction: {
          storeId,
        },
      },
      include: {
        transaction: true,
      },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    if (payment.status === 'REFUNDED') {
      res.status(400).json({ error: 'Payment already refunded' });
      return;
    }

    // Process refund with circuit breaker
    const refundResult = await paymentGatewayCircuit.execute(async () => {
      return await retryWithJitter(
        async () => {
          // Simulate refund API call
          await new Promise(resolve => setTimeout(resolve, 500));
          return {
            success: true,
            reference: `refund_${Date.now()}`,
          };
        },
        {
          maxAttempts: 3,
          baseDelay: 1000,
          jitterType: JitterType.FULL,
        }
      );
    });

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        metadata: {
          refundReference: refundResult.reference,
          refundedAt: new Date().toISOString(),
          refundedBy: userId,
        },
      },
    });

    // Update transaction status
    await prisma.transaction.update({
      where: { id: payment.transactionId },
      data: { status: 'REFUNDED' },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PAYMENT_REFUNDED',
        entity: 'Payment',
        entityId: id,
        oldValue: { status: payment.status },
        newValue: { status: 'REFUNDED', refundReference: refundResult.reference },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      message: 'Payment refunded successfully',
      payment: updatedPayment,
    });
  } catch (error: any) {
    console.error('[Refund] Error:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get circuit breaker status
 * GET /api/payments/circuit-status
 */
export async function getCircuitStatus(req: AuthRequest, res: Response): Promise<void> {
  const circuits = CircuitBreakerRegistry.getAll();
  res.json({ circuits });
}
