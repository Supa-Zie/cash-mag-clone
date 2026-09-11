# CashMag - Complete Setup Guide

## 🎯 Overview

CashMag is a full-stack POS (Point of Sale) system with:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Features**: Row-level security, idempotency, circuit breakers, retry with jitter

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for cloning)

## 🚀 Quick Start

### 1. Clone/Download the Project

```bash
# If using git
git clone <repository-url>
cd cashmag

# Or download and extract the ZIP file
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

**Edit these lines in `.env`:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cashmag?schema=public"
JWT_SECRET="change-this-to-a-random-32-character-string"
JWT_REFRESH_SECRET="change-this-to-another-random-32-character-string"
```

**Create PostgreSQL database:**
```bash
# On Mac/Linux
psql -U postgres -c "CREATE DATABASE cashmag;"

# On Windows (using pgAdmin or command line)
# Open pgAdmin and create a new database named "cashmag"
```

**Run migrations and seed data:**
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

Backend will be available at: `http://localhost:3001`

### 3. Setup Frontend

**Open a new terminal window:**

```bash
# Navigate to project root (where package.json is)
cd /path/to/cashmag

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 4. Login

Use these credentials to login:

| Email | Password | Role |
|-------|----------|------|
| admin@cashmag.ch | admin123 | OWNER |
| manager@cashmag.ch | manager123 | MANAGER |
| cashier@cashmag.ch | cashier123 | CASHIER |

## 🔧 Troubleshooting

### Backend Issues

**"Cannot find module '@prisma/client'"**
```bash
cd backend
npm install
npm run prisma:generate
```

**"Database connection failed"**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database "cashmag" exists

**"Port 3001 already in use"**
```bash
# Edit .env and change PORT
PORT=3002
```

### Frontend Issues

**"Cannot connect to backend"**
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify VITE_API_URL in frontend (defaults to http://localhost:3001/api)

**"Module not found" errors**
```bash
npm install
```

### PostgreSQL Issues

**"password authentication failed"**
- Update DATABASE_URL with correct PostgreSQL password
- Default password is often "postgres" or empty

**"database does not exist"**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE cashmag;"
```

## 📊 Testing the System

### Test Payment with Idempotency

```bash
# 1. Login and get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cashmag.ch","password":"admin123"}'

# Copy the token from response

# 2. Process payment with idempotency key
curl -X POST http://localhost:3001/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Idempotency-Key: test-payment-001" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "transaction-id-here",
    "amount": 100.00,
    "currency": "CHF",
    "method": "CARD"
  }'

# 3. Send same request again (should return cached response)
# Same curl command - notice it returns immediately without processing
```

### Test Circuit Breaker

```bash
# Check circuit breaker status
curl http://localhost:3001/api/payments/circuit-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🏗️ Production Deployment

### Backend

```bash
cd backend

# Build
npm run build

# Set production environment
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@production-db:5432/cashmag"
JWT_SECRET="strong-production-secret"

# Start
npm start
```

### Frontend

```bash
# Build
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Any static hosting
```

### Docker Deployment

**backend/Dockerfile:**
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

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: cashmag
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/cashmag
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to a strong random string (32+ chars)
- [ ] Change JWT_REFRESH_SECRET to a different strong random string
- [ ] Use HTTPS in production
- [ ] Set strong PostgreSQL password
- [ ] Enable CORS for specific origins only
- [ ] Set up rate limiting (already configured)
- [ ] Regular database backups
- [ ] Keep dependencies updated: `npm audit fix`

## 📚 Documentation

- **Backend API**: See `backend/README.md`
- **Database Schema**: See `backend/prisma/schema.prisma`
- **Frontend Components**: See `src/components/` and `src/pages/`

## 🆘 Support

For issues:
1. Check the troubleshooting section above
2. Review backend logs: `backend/npm run dev` output
3. Check browser console (F12) for frontend errors
4. Verify database connection with `npm run prisma:studio`

## 🎉 You're Ready!

Once both servers are running:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health check: http://localhost:3001/health

Login with any of the test accounts and start exploring the system!
