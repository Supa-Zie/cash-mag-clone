import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create store
  const store = await prisma.store.upsert({
    where: { id: 'store-001' },
    update: {},
    create: {
      id: 'store-001',
      name: 'CashMag Genève Centre',
      address: 'Rue du Mont-Blanc 15',
      city: 'Genève',
      postalCode: '1201',
      country: 'CH',
      phone: '+41 22 700 77 07',
      email: 'geneve@cashmag.ch',
      taxNumber: 'CHE-123.456.789 TVA',
      currency: 'CHF',
      timezone: 'Europe/Zurich',
    },
  });

  console.log('✓ Store created:', store.name);

  // Create cash register
  const cashRegister = await prisma.cashRegister.upsert({
    where: { id: 'register-001' },
    update: {},
    create: {
      id: 'register-001',
      storeId: store.id,
      name: 'Caisse Principale',
      location: 'Rez-de-chaussée',
      isOpen: true,
      openingAmount: 200,
      currentAmount: 200,
    },
  });

  console.log('✓ Cash register created:', cashRegister.name);

  // Create users
  const users = [
    {
      id: 'user-001',
      email: 'admin@cashmag.ch',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'OWNER' as const,
    },
    {
      id: 'user-002',
      email: 'manager@cashmag.ch',
      password: 'manager123',
      firstName: 'Marie',
      lastName: 'Laurent',
      role: 'MANAGER' as const,
    },
    {
      id: 'user-003',
      email: 'cashier@cashmag.ch',
      password: 'cashier123',
      firstName: 'Pierre',
      lastName: 'Dubois',
      role: 'CASHIER' as const,
    },
  ];

  for (const userData of users) {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    await prisma.user.upsert({
      where: { id: userData.id },
      update: {},
      create: {
        id: userData.id,
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        storeId: store.id,
      },
    });

    console.log(`✓ User created: ${userData.email} (${userData.role})`);
  }

  // Create products
  const products = [
    { sku: 'DRINK-001', name: 'Coca-Cola 33cl', category: 'Boissons', price: 2.50, cost: 1.20, stock: 48, barcode: '5449000000996' },
    { sku: 'DRINK-002', name: 'Eau Evian 1.5L', category: 'Boissons', price: 1.80, cost: 0.80, stock: 36, barcode: '3068320011103' },
    { sku: 'DRINK-003', name: 'Café Expresso', category: 'Boissons', price: 2.00, cost: 0.30, stock: 999 },
    { sku: 'BAKERY-001', name: 'Croissant', category: 'Boulangerie', price: 1.50, cost: 0.40, stock: 12 },
    { sku: 'BAKERY-002', name: 'Pain au Chocolat', category: 'Boulangerie', price: 1.80, cost: 0.50, stock: 8 },
    { sku: 'BAKERY-003', name: 'Baguette Tradition', category: 'Boulangerie', price: 1.20, cost: 0.30, stock: 15 },
    { sku: 'FOOD-001', name: 'Sandwich Jambon', category: 'Alimentation', price: 5.50, cost: 2.50, stock: 6 },
    { sku: 'FOOD-002', name: 'Salade César', category: 'Alimentation', price: 8.50, cost: 3.50, stock: 4 },
    { sku: 'SNACK-001', name: 'Chips Lays', category: 'Snacks', price: 2.20, cost: 1.00, stock: 30, barcode: '5400118021924' },
    { sku: 'SNACK-002', name: 'Barre Chocolat', category: 'Snacks', price: 1.50, cost: 0.60, stock: 42, barcode: '5000159402973' },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productData,
        storeId: store.id,
        price: productData.price,
        cost: productData.cost,
      },
    });
  }

  console.log(`✓ ${products.length} products created`);

  // Create sample transaction
  const product1 = await prisma.product.findFirst({ where: { sku: 'DRINK-001' } });
  const product2 = await prisma.product.findFirst({ where: { sku: 'BAKERY-001' } });

  if (product1 && product2) {
    const transaction = await prisma.transaction.create({
      data: {
        storeId: store.id,
        cashRegisterId: cashRegister.id,
        userId: 'user-003',
        orderType: 'SALE',
        status: 'COMPLETED',
        subtotal: 4.00,
        taxAmount: 0.72,
        total: 4.72,
        items: {
          create: [
            {
              productId: product1.id,
              quantity: 1,
              unitPrice: product1.price,
              taxRate: 7.7,
              taxAmount: 0.19,
              total: 2.69,
            },
            {
              productId: product2.id,
              quantity: 1,
              unitPrice: product2.price,
              taxRate: 7.7,
              taxAmount: 0.11,
              total: 1.61,
            },
          ],
        },
        payments: {
          create: {
            method: 'CARD',
            status: 'COMPLETED',
            amount: 4.72,
            currency: 'CHF',
            idempotencyKey: `seed_${Date.now()}`,
            externalRef: 'seed_ref_001',
            processor: 'stripe',
            processedAt: new Date(),
          },
        },
      },
    });

    console.log('✓ Sample transaction created:', transaction.id);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin:   admin@cashmag.ch / admin123');
  console.log('   Manager: manager@cashmag.ch / manager123');
  console.log('   Cashier: cashier@cashmag.ch / cashier123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
