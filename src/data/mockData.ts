export interface Product {
  id: string;
  name: string;
  nameEn: string;
  nameDe: string;
  price: number;
  category: string;
  barcode: string;
  stock: number;
  reorderPoint: number;
  status: 'active' | 'archived';
  image?: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'split';
  cashier: string;
  receiptNo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const categories = [
  { id: 'all', name: 'Tout', nameEn: 'All', nameDe: 'Alle', color: '#6366f1' },
  { id: 'drinks', name: 'Boissons', nameEn: 'Drinks', nameDe: 'Getränke', color: '#3b82f6' },
  { id: 'food', name: 'Alimentation', nameEn: 'Food', nameDe: 'Lebensmittel', color: '#10b981' },
  { id: 'bakery', name: 'Boulangerie', nameEn: 'Bakery', nameDe: 'Bäckerei', color: '#f59e0b' },
  { id: 'snacks', name: 'Snacks', nameEn: 'Snacks', nameDe: 'Snacks', color: '#ef4444' },
  { id: 'hygiene', name: 'Hygiène', nameEn: 'Hygiene', nameDe: 'Hygiene', color: '#8b5cf6' },
  { id: 'tobacco', name: 'Tabac', nameEn: 'Tobacco', nameDe: 'Tabak', color: '#6b7280' },
];

export const products: Product[] = [
  { id: '1', name: 'Coca-Cola 33cl', nameEn: 'Coca-Cola 33cl', nameDe: 'Coca-Cola 33cl', price: 2.50, category: 'drinks', barcode: '5449000000996', stock: 48, reorderPoint: 20, status: 'active' },
  { id: '2', name: 'Eau Evian 1.5L', nameEn: 'Evian Water 1.5L', nameDe: 'Evian Wasser 1.5L', price: 1.80, category: 'drinks', barcode: '3068320011103', stock: 36, reorderPoint: 15, status: 'active' },
  { id: '3', name: 'Café Expresso', nameEn: 'Espresso Coffee', nameDe: 'Espresso Kaffee', price: 2.00, category: 'drinks', barcode: '', stock: 999, reorderPoint: 0, status: 'active' },
  { id: '4', name: 'Thé Vert', nameEn: 'Green Tea', nameDe: 'Grüner Tee', price: 2.50, category: 'drinks', barcode: '', stock: 999, reorderPoint: 0, status: 'active' },
  { id: '5', name: 'Jus d\'Orange 25cl', nameEn: 'Orange Juice 25cl', nameDe: 'Orangensaft 25cl', price: 3.00, category: 'drinks', barcode: '3124480191984', stock: 24, reorderPoint: 10, status: 'active' },
  { id: '6', name: 'Croissant', nameEn: 'Croissant', nameDe: 'Croissant', price: 1.50, category: 'bakery', barcode: '', stock: 12, reorderPoint: 8, status: 'active' },
  { id: '7', name: 'Pain au Chocolat', nameEn: 'Chocolate Bread', nameDe: 'Schokoladenbrot', price: 1.80, category: 'bakery', barcode: '', stock: 8, reorderPoint: 8, status: 'active' },
  { id: '8', name: 'Baguette Tradition', nameEn: 'Traditional Baguette', nameDe: 'Traditionelles Baguette', price: 1.20, category: 'bakery', barcode: '', stock: 15, reorderPoint: 10, status: 'active' },
  { id: '9', name: 'Sandwich Jambon', nameEn: 'Ham Sandwich', nameDe: 'Schinkensandwich', price: 5.50, category: 'food', barcode: '', stock: 6, reorderPoint: 5, status: 'active' },
  { id: '10', name: 'Salade César', nameEn: 'Caesar Salad', nameDe: 'Caesar Salat', price: 8.50, category: 'food', barcode: '', stock: 4, reorderPoint: 3, status: 'active' },
  { id: '11', name: 'Quiche Lorraine', nameEn: 'Lorraine Quiche', nameDe: 'Lothringer Quiche', price: 4.50, category: 'food', barcode: '', stock: 3, reorderPoint: 5, status: 'active' },
  { id: '12', name: 'Chips Lays', nameEn: 'Lays Chips', nameDe: 'Lays Chips', price: 2.20, category: 'snacks', barcode: '5400118021924', stock: 30, reorderPoint: 15, status: 'active' },
  { id: '13', name: 'Barre Chocolat', nameEn: 'Chocolate Bar', nameDe: 'Schokoladenriegel', price: 1.50, category: 'snacks', barcode: '5000159402973', stock: 42, reorderPoint: 20, status: 'active' },
  { id: '14', name: 'Cookies', nameEn: 'Cookies', nameDe: 'Cookies', price: 2.80, category: 'snacks', barcode: '7612100055793', stock: 18, reorderPoint: 10, status: 'active' },
  { id: '15', name: 'Savon Liquide', nameEn: 'Liquid Soap', nameDe: 'Flüssigseife', price: 3.90, category: 'hygiene', barcode: '3257980920538', stock: 15, reorderPoint: 8, status: 'active' },
  { id: '16', name: 'Dentifrice', nameEn: 'Toothpaste', nameDe: 'Zahnpasta', price: 3.50, category: 'hygiene', barcode: '8718951152889', stock: 20, reorderPoint: 10, status: 'active' },
  { id: '17', name: 'Marlboro Rouge', nameEn: 'Marlboro Red', nameDe: 'Marlboro Rot', price: 11.00, category: 'tobacco', barcode: '54250127', stock: 50, reorderPoint: 20, status: 'active' },
  { id: '18', name: 'Camel Blue', nameEn: 'Camel Blue', nameDe: 'Camel Blue', price: 11.00, category: 'tobacco', barcode: '54250134', stock: 40, reorderPoint: 20, status: 'active' },
  { id: '19', name: 'Red Bull 25cl', nameEn: 'Red Bull 25cl', nameDe: 'Red Bull 25cl', price: 2.80, category: 'drinks', barcode: '9002490100070', stock: 30, reorderPoint: 15, status: 'active' },
  { id: '20', name: 'Pasta Barilla 500g', nameEn: 'Barilla Pasta 500g', nameDe: 'Barilla Pasta 500g', price: 1.95, category: 'food', barcode: '8076802085383', stock: 25, reorderPoint: 12, status: 'active' },
];

export const transactions: Transaction[] = [
  {
    id: '1', date: '2026-01-15', time: '08:32',
    items: [{ productId: '1', name: 'Coca-Cola 33cl', quantity: 2, price: 2.50 }, { productId: '6', name: 'Croissant', quantity: 1, price: 1.50 }],
    subtotal: 5.53, tax: 1.03, total: 6.50, paymentMethod: 'cash', cashier: 'Marie L.', receiptNo: 'REC-001'
  },
  {
    id: '2', date: '2026-01-15', time: '09:15',
    items: [{ productId: '17', name: 'Marlboro Rouge', quantity: 1, price: 11.00 }],
    subtotal: 10.28, tax: 0.72, total: 11.00, paymentMethod: 'cash', cashier: 'Marie L.', receiptNo: 'REC-002'
  },
  {
    id: '3', date: '2026-01-15', time: '09:45',
    items: [{ productId: '3', name: 'Café Expresso', quantity: 2, price: 2.00 }, { productId: '7', name: 'Pain au Chocolat', quantity: 2, price: 1.80 }],
    subtotal: 6.34, tax: 1.16, total: 7.60, paymentMethod: 'card', cashier: 'Marie L.', receiptNo: 'REC-003'
  },
  {
    id: '4', date: '2026-01-15', time: '10:20',
    items: [{ productId: '9', name: 'Sandwich Jambon', quantity: 1, price: 5.50 }, { productId: '2', name: 'Eau Evian 1.5L', quantity: 1, price: 1.80 }],
    subtotal: 6.08, tax: 1.22, total: 7.30, paymentMethod: 'card', cashier: 'Pierre D.', receiptNo: 'REC-004'
  },
  {
    id: '5', date: '2026-01-15', time: '11:05',
    items: [{ productId: '12', name: 'Chips Lays', quantity: 1, price: 2.20 }, { productId: '5', name: 'Jus d\'Orange 25cl', quantity: 1, price: 3.00 }, { productId: '13', name: 'Barre Chocolat', quantity: 1, price: 1.50 }],
    subtotal: 5.57, tax: 1.03, total: 6.70, paymentMethod: 'cash', cashier: 'Pierre D.', receiptNo: 'REC-005'
  },
  {
    id: '6', date: '2026-01-15', time: '12:30',
    items: [{ productId: '10', name: 'Salade César', quantity: 2, price: 8.50 }, { productId: '19', name: 'Red Bull 25cl', quantity: 2, price: 2.80 }],
    subtotal: 21.12, tax: 3.88, total: 22.60, paymentMethod: 'card', cashier: 'Marie L.', receiptNo: 'REC-006'
  },
  {
    id: '7', date: '2026-01-15', time: '13:15',
    items: [{ productId: '8', name: 'Baguette Tradition', quantity: 3, price: 1.20 }, { productId: '6', name: 'Croissant', quantity: 4, price: 1.50 }],
    subtotal: 8.04, tax: 1.46, total: 9.60, paymentMethod: 'cash', cashier: 'Pierre D.', receiptNo: 'REC-007'
  },
  {
    id: '8', date: '2026-01-15', time: '14:00',
    items: [{ productId: '15', name: 'Savon Liquide', quantity: 1, price: 3.90 }, { productId: '16', name: 'Dentifrice', quantity: 1, price: 3.50 }],
    subtotal: 6.17, tax: 1.23, total: 7.40, paymentMethod: 'card', cashier: 'Marie L.', receiptNo: 'REC-008'
  },
  {
    id: '9', date: '2026-01-15', time: '15:20',
    items: [{ productId: '14', name: 'Cookies', quantity: 2, price: 2.80 }, { productId: '4', name: 'Thé Vert', quantity: 1, price: 2.50 }],
    subtotal: 6.77, tax: 1.33, total: 8.10, paymentMethod: 'cash', cashier: 'Pierre D.', receiptNo: 'REC-009'
  },
  {
    id: '10', date: '2026-01-15', time: '16:45',
    items: [{ productId: '20', name: 'Pasta Barilla 500g', quantity: 2, price: 1.95 }, { productId: '11', name: 'Quiche Lorraine', quantity: 1, price: 4.50 }],
    subtotal: 7.01, tax: 1.39, total: 8.40, paymentMethod: 'split', cashier: 'Marie L.', receiptNo: 'REC-010'
  },
];

export const salesData = [
  { hour: '08h', sales: 45 },
  { hour: '09h', sales: 78 },
  { hour: '10h', sales: 120 },
  { hour: '11h', sales: 195 },
  { hour: '12h', sales: 310 },
  { hour: '13h', sales: 280 },
  { hour: '14h', sales: 150 },
  { hour: '15h', sales: 110 },
  { hour: '16h', sales: 165 },
  { hour: '17h', sales: 220 },
  { hour: '18h', sales: 290 },
  { hour: '19h', sales: 180 },
];

export const weeklyData = [
  { day: 'Lun', sales: 1250 },
  { day: 'Mar', sales: 1480 },
  { day: 'Mer', sales: 1320 },
  { day: 'Jeu', sales: 1590 },
  { day: 'Ven', sales: 1850 },
  { day: 'Sam', sales: 2100 },
  { day: 'Dim', sales: 980 },
];

export const categorySales = [
  { name: 'Boissons', value: 35, color: '#3b82f6' },
  { name: 'Boulangerie', value: 22, color: '#f59e0b' },
  { name: 'Alimentation', value: 18, color: '#10b981' },
  { name: 'Snacks', value: 12, color: '#ef4444' },
  { name: 'Hygiène', value: 8, color: '#8b5cf6' },
  { name: 'Tabac', value: 5, color: '#6b7280' },
];

export const paymentBreakdown = [
  { name: 'Espèces', value: 42, color: '#10b981' },
  { name: 'Carte', value: 52, color: '#3b82f6' },
  { name: 'Mixte', value: 6, color: '#f59e0b' },
];
