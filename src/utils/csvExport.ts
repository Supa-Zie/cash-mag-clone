/**
 * CSV Export Utility
 * Handles exporting data to CSV format with proper escaping
 */

export interface CSVExportOptions {
  filename?: string;
  includeTimestamp?: boolean;
  separator?: string;
}

/**
 * Escape CSV value to handle commas, quotes, and newlines
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape quotes by doubling them
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  
  return stringValue;
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) {
    return '';
  }

  // Use provided headers or extract from first object
  const keys = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = keys.map(escapeCSVValue).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return keys.map(key => escapeCSVValue(item[key])).join(',');
  });
  
  // Combine all rows
  return [headerRow, ...rows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(
  data: any[],
  filename: string = 'export',
  options: CSVExportOptions = {}
): void {
  const {
    includeTimestamp = true,
    separator = ',',
  } = options;

  // Generate filename with timestamp if requested
  const finalFilename = includeTimestamp
    ? `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    : `${filename}.csv`;

  // Convert data to CSV
  const csvContent = convertToCSV(data);
  
  // Add BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;
  
  // Create blob and download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(transactions: any[]): void {
  const exportData = transactions.map(tx => ({
    'Receipt Number': tx.receiptNo,
    'Date': tx.date,
    'Time': tx.time,
    'Items': tx.items.length,
    'Subtotal': tx.subtotal.toFixed(2),
    'Tax': tx.tax.toFixed(2),
    'Total': tx.total.toFixed(2),
    'Payment Method': tx.paymentMethod,
    'Cashier': tx.cashier,
  }));

  downloadCSV(exportData, 'transactions');
}

/**
 * Export products to CSV
 */
export function exportProductsToCSV(products: any[]): void {
  const exportData = products.map(product => ({
    'ID': product.id,
    'Name': product.name,
    'Price': product.price.toFixed(2),
    'Category': product.category,
    'Stock': product.stock,
    'Status': product.status,
    'Barcode': product.barcode || '',
  }));

  downloadCSV(exportData, 'products');
}

/**
 * Export inventory to CSV
 */
export function exportInventoryToCSV(inventory: any[]): void {
  const exportData = inventory.map(item => ({
    'Product': item.productName,
    'Current Stock': item.currentStock,
    'Minimum Stock': item.minStock,
    'Status': item.status,
    'Last Restocked': item.lastRestocked,
  }));

  downloadCSV(exportData, 'inventory');
}

/**
 * Export employees to CSV
 */
export function exportEmployeesToCSV(employees: any[]): void {
  const exportData = employees.map(emp => ({
    'Name': emp.name,
    'Role': emp.role,
    'Email': emp.email,
    'Phone': emp.phone,
    'Status': emp.status,
    'Total Sales': emp.totalSales.toFixed(2),
    'Transactions': emp.transactions,
    'Join Date': emp.joinDate,
  }));

  downloadCSV(exportData, 'employees');
}

/**
 * Export loyalty customers to CSV
 */
export function exportLoyaltyToCSV(customers: any[]): void {
  const exportData = customers.map(customer => ({
    'Name': customer.name,
    'Email': customer.email,
    'Phone': customer.phone,
    'Points': customer.points,
    'Tier': customer.tier,
    'Total Spent': customer.totalSpent.toFixed(2),
    'Visits': customer.visits,
    'Last Visit': customer.lastVisit,
    'Join Date': customer.joinDate,
  }));

  downloadCSV(exportData, 'loyalty_customers');
}
