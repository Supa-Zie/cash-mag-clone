import { Transaction } from '../data/mockData';

export function generateReceiptHTML(transaction: Transaction, storeName: string = 'CashMag'): string {
  const date = new Date().toLocaleDateString('fr-CH');
  const time = new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });

  return `
    <div class="receipt print-receipt" id="receipt-print">
      <div class="receipt-header">
        <h2 style="margin:0; font-size:16px;">${storeName}</h2>
        <p style="margin:2px 0;">Rue du Commerce 12</p>
        <p style="margin:2px 0;">1200 Genève, Suisse</p>
        <p style="margin:2px 0;">Tél: +41 22 123 45 67</p>
        <p style="margin:4px 0; font-size:10px;">────────────────────────</p>
        <p style="margin:2px 0;">Reçu: ${transaction.receiptNo}</p>
        <p style="margin:2px 0;">Date: ${date} ${time}</p>
        <p style="margin:2px 0;">Caissier: ${transaction.cashier}</p>
      </div>
      
      <div class="receipt-items">
        ${transaction.items.map(item => `
          <div class="receipt-item">
            <span>${item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <div style="font-size:10px; color:#666; margin-bottom:4px;">
            ${item.quantity} x ${item.price.toFixed(2)}
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom:8px;">
        <div class="receipt-item">
          <span>Sous-total:</span>
          <span>${transaction.subtotal.toFixed(2)} CHF</span>
        </div>
        <div class="receipt-item">
          <span>TVA (8.1%):</span>
          <span>${transaction.tax.toFixed(2)} CHF</span>
        </div>
        <div class="receipt-item receipt-total" style="border-top:1px dashed #999; padding-top:4px; margin-top:4px;">
          <span>TOTAL:</span>
          <span>${transaction.total.toFixed(2)} CHF</span>
        </div>
      </div>
      
      <div style="text-align:center; font-size:11px; margin-bottom:4px;">
        Paiement: ${transaction.paymentMethod === 'cash' ? 'Espèces' : transaction.paymentMethod === 'card' ? 'Carte' : 'Mixte'}
      </div>
      
      <div class="receipt-footer">
        <p style="margin:2px 0;">Merci de votre visite!</p>
        <p style="margin:2px 0;">À bientôt chez ${storeName}</p>
        <p style="margin:8px 0 2px; font-size:9px;">────────────────────────</p>
        <p style="margin:2px 0; font-size:9px;">NF525 Certifié · Journal inaltérable</p>
        <p style="margin:2px 0; font-size:9px;">www.cashmag.ch</p>
      </div>
    </div>
  `;
}

export function printReceipt(transaction: Transaction, storeName?: string) {
  const receiptHTML = generateReceiptHTML(transaction, storeName);
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reçu ${transaction.receiptNo}</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            margin: 0; 
            padding: 10mm;
            font-size: 12px;
            line-height: 1.5;
          }
          .receipt { max-width: 280px; margin: 0 auto; }
          .receipt-header { text-align: center; border-bottom: 1px dashed #999; padding-bottom: 8px; margin-bottom: 8px; }
          .receipt-items { border-bottom: 1px dashed #999; padding-bottom: 8px; margin-bottom: 8px; }
          .receipt-item { display: flex; justify-content: space-between; margin-bottom: 4px; }
          .receipt-total { font-weight: bold; font-size: 14px; }
          .receipt-footer { text-align: center; margin-top: 8px; font-size: 10px; color: #666; }
          @media print {
            body { padding: 5mm; }
          }
        </style>
      </head>
      <body>${receiptHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

export function downloadReceiptPDF(transaction: Transaction, storeName?: string) {
  const receiptHTML = generateReceiptHTML(transaction, storeName);
  const blob = new Blob([`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reçu ${transaction.receiptNo}</title>
      <style>
        body { font-family: 'Courier New', monospace; margin: 20px; font-size: 12px; line-height: 1.5; }
        .receipt { max-width: 280px; margin: 0 auto; }
        .receipt-header { text-align: center; border-bottom: 1px dashed #999; padding-bottom: 8px; margin-bottom: 8px; }
        .receipt-items { border-bottom: 1px dashed #999; padding-bottom: 8px; margin-bottom: 8px; }
        .receipt-item { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .receipt-total { font-weight: bold; font-size: 14px; }
        .receipt-footer { text-align: center; margin-top: 8px; font-size: 10px; color: #666; }
      </style>
    </head>
    <body>${receiptHTML}</body>
    </html>
  `], { type: 'text/html' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recu_${transaction.receiptNo}_${transaction.date}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
