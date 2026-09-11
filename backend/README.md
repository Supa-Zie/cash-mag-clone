# CashMag Backend API

Enterprise-grade POS backend with row-level security, idempotency, circuit breakers, and retry logic with jitter.

## 🏗️ Architecture

### Core Features

- **Row-Level Security (RLS)** - PostgreSQL policies ensure users only access their store's data
- **Idempotency Keys** - Prevent duplicate payments and operations
- **Circuit Breakers** - Handle external service failures gracefully
- **Retry with Jitter** - Exponential backoff with randomness to prevent thundering herd
- **Role-Based Access Control (RBAC)** - OWNER, MANAGER, CASHIER, INVENTORY, VIEWER roles
- **Audit Logging** - Track all operations for compliance
- **Rate Limiting** - Protect against abuse
- **JWT Authentication** - Secure token-based auth with refresh tokens

### Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod for request validation

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # Prisma client setup
│   │   └── env.ts            # Environment configuration
│   ├── middleware/
│   │   └── auth.ts           # Authentication & RBAC
│   ├── controllers/
│   │   └── paymentController.ts  # Payment processing
│   ├── utils/
│   │   ├── circuitBreaker.ts # Circuit breaker pattern
│   │   ├── idempotency.ts    # Idempotency key handling
│   │   └── jitter.ts         # Exponential backoff with jitter
│   └── index.ts              # Main entry point
├── prisma/
│   ├── schema.prisma         # Database schema with RLS
│   └── seed.ts               # Seed data
├── .env.example              # Environment template
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env with your database credentials
nano .env

# 5. Generate Prisma client
npm run prisma:generate

# 6. Run database migrations
npm run prisma:migrate

# 7. Seed database with sample data
npm run prisma:seed

# 8. Start development server
npm run dev
```

The API will be available at `http://localhost:3001`

## 🔐 Authentication

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@cashmag.ch",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user-001",
    "email": "admin@cashmag.ch",
    "firstName": "Admin",
    "lastName": "User",
    "role": "OWNER",
    "storeId": "store-001",
    "storeName": "CashMag Genève Centre"
  }
}
```

### Using Protected Routes

```bash
GET /api/products
Authorization: Bearer eyJhbGc...
```

## 💳 Payment Processing with Idempotency

### Process Payment

```bash
POST /api/payments
Authorization: Bearer <token>
Idempotency-Key: unique-key-123
Content-Type: application/json

{
  "transactionId": "txn-001",
  "amount": 100.00,
  "currency": "CHF",
  "method": "CARD"
}
```

**Idempotency Behavior:**
- First request: Processes payment, stores response
- Duplicate request (same key): Returns cached response
- Conflict (same key, different body): Returns 409 error

### Refund Payment

```bash
POST /api/payments/:id/refund
Authorization: Bearer <token>
Idempotency-Key: refund-key-456
```

## 🛡️ Circuit Breaker

The circuit breaker protects against cascading failures:

```bash
GET /api/payments/circuit-status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "circuits": [
    {
      "name": "payment-gateway",
      "state": "CLOSED",
      "failureCount": 0,
      "successCount": 5,
      "lastFailureTime": null
    }
  ]
}
```

**States:**
- `CLOSED` - Normal operation
- `OPEN` - Failing, rejecting requests
- `HALF_OPEN` - Testing recovery

## 🔄 Retry with Jitter

All external calls use exponential backoff with jitter:

```typescript
// Example from paymentController.ts
await retryWithJitter(
  () => processExternalPayment(data),
  {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    jitterType: JitterType.FULL,
  }
);
```

**Jitter Types:**
- `NONE` - Fixed delay
- `FULL` - Random between 0 and delay
- `EQUAL` - Random between delay/2 and delay
- `DECORRELATED` - Random between base and 3x previous

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - List products (store-scoped)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions
- `GET /api/transactions` - List transactions (store-scoped)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction

### Payments
- `POST /api/payments` - Process payment (idempotent)
- `GET /api/payments/:id` - Get payment
- `POST /api/payments/:id/refund` - Refund payment (idempotent)
- `GET /api/payments/circuit-status` - Circuit breaker status

### Users
- `GET /api/users` - List users (store-scoped)
- `POST /api/users` - Create user (MANAGER+ only)

## 🔒 Row-Level Security

All queries are automatically scoped to the user's store via PostgreSQL RLS policies:

```sql
-- Example policy
CREATE POLICY "Users can view products in their store"
  ON "Product" FOR SELECT
  USING (storeId = current_setting('app.current_store_id')::uuid);
```

When a user authenticates, the middleware sets session variables:
```sql
SET app.current_user_id = 'user-001';
SET app.current_store_id = 'store-001';
SET app.current_user_role = 'OWNER';
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Production Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```bash
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/cashmag"
JWT_SECRET="strong-random-secret-min-32-chars"
CORS_ORIGINS="https://your-frontend.com"
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📝 Audit Logging

All operations are logged:

```typescript
await prisma.auditLog.create({
  data: {
    userId: 'user-001',
    action: 'PAYMENT_PROCESSED',
    entity: 'Payment',
    entityId: 'pay-123',
    newValue: { amount: 100, currency: 'CHF' },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
  },
});
```

## 🎯 Default Users

After seeding:

| Email | Password | Role |
|-------|----------|------|
| admin@cashmag.ch | admin123 | OWNER |
| manager@cashmag.ch | manager123 | MANAGER |
| cashier@cashmag.ch | cashier123 | CASHIER |

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Reset database
npm run prisma:migrate reset
```

### Port Already in Use

```bash
# Change PORT in .env
PORT=3002
```

### Circuit Breaker Stuck Open

The circuit breaker automatically resets after the timeout period (default: 60s).

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Idempotency Keys](https://stripe.com/docs/api/idempotent_requests)
- [Exponential Backoff](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

## 📄 License

MIT

## 🤝 Support

For issues and questions, please open an issue on GitHub.
