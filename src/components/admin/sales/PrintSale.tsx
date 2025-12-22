import { useRef, useImperativeHandle, forwardRef } from 'react';
import { ISalePopulated } from '@/types/sale';

interface PrintSaleProps {
  sale: ISalePopulated;
}

export interface PrintSaleRef {
  print: () => void;
}

export const PrintSale = forwardRef<PrintSaleRef, PrintSaleProps>(
  ({ sale }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
      const clientName = sale.client?.name || 'Sin Cliente';
      const fileName = `Venta_${sale.saleNumber}_${clientName.replace(/\s/g, '_')}`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${fileName}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 20mm;
              font-size: 12pt;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            
            .header h1 {
              color: #000;
              font-size: 24pt;
              margin-bottom: 10px;
            }
            
            .sale-number {
              font-size: 18pt;
              color: #333;
              margin-bottom: 5px;
            }
            
            .section {
              margin-bottom: 25px;
            }
            
            .section-title {
              background-color: #fff;
              color: #000;
              border: 2px solid #000;
              padding: 10px;
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 10px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
            }
            
            .info-item {
              padding: 8px;
              border-bottom: 1px solid #ddd;
            }
            
            .info-label {
              font-weight: bold;
              color: #000;
            }
            
            .products-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            .products-table th {
              background-color: #000;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            
            .products-table td {
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            
            .products-table tr:hover {
              background-color: #f5f5f5;
            }
            
            .totals {
              margin-top: 20px;
              text-align: right;
            }
            
            .totals-row {
              display: flex;
              justify-content: flex-end;
              padding: 8px 0;
              font-size: 14pt;
            }
            
            .totals-label {
              margin-right: 20px;
              font-weight: bold;
            }
            
            .total-final {
              font-size: 18pt;
              color: #000;
              font-weight: bold;
              border-top: 2px solid #000;
              padding-top: 10px;
              margin-top: 10px;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10pt;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            
            @media print {
              body {
                padding: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>McLeon</h1>
            <div class="sale-number">Venta N° ${sale.saleNumber}</div>
            <div>${new Date(sale.createdAt || new Date()).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            } as Intl.DateTimeFormatOptions)} ${new Date(sale.createdAt || new Date()).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit'
            } as Intl.DateTimeFormatOptions)}</div>
          </div>

          <div class="section">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nombre:</div>
                <div>${sale.client?.name || 'Sin Cliente'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Documento:</div>
                <div>${sale.client?.documentNumber || '-'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Método de Pago:</div>
                <div>${sale.paymentMethod}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tipo de Entrega:</div>
                <div>${sale.deliveryType === 'RETIRO_LOCAL' ? 'Retiro Local' : 'Envío a Domicilio'}</div>
              </div>
              ${sale.deliveryType === 'DELIVERY' && sale.deliveryAddress ? `
              <div class="info-item" style="grid-column: 1 / -1;">
                <div class="info-label">Dirección de Entrega:</div>
                <div>${sale.deliveryAddress}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <table class="products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Costo</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${sale.products.map(item => {
                  const product = typeof item.product === 'object' ? item.product : null;
                  const subtotal = item.unitPrice * item.quantity;
                  const discount = item.discountPercentage > 0 
                    ? `${item.discountPercentage}%` 
                    : '-';
                  
                  return `
                    <tr>
                      <td>${product?.name || 'Producto eliminado'}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                      <td>${discount}</td>
                      <td>$${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="totals-row">
              <span class="totals-label">Subtotal:</span>
              <span>$${sale.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            ${sale.deliveryFee && sale.deliveryFee > 0 ? `
            <div class="totals-row">
              <span class="totals-label">Envío:</span>
              <span>$${sale.deliveryFee.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            ` : ''}
            ${sale.totalDiscount && sale.totalDiscount > 0 ? `
            <div class="totals-row">
              <span class="totals-label">Descuento Total:</span>
              <span>-$${sale.totalDiscount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            ` : ''}
            <div class="totals-row total-final">
              <span class="totals-label">TOTAL:</span>
              <span>$${sale.totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            ${sale.amountPaid && sale.amountPaid > 0 ? `
            <div class="totals-row" style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; color: #000;">
              <span class="totals-label">Pago Actual:</span>
              <span>$${sale.amountPaid.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            ${sale.amountPaid < sale.totalAmount ? `
            <div class="totals-row" style="color: #000;">
              <span class="totals-label">Faltante:</span>
              <span>$${(sale.totalAmount - sale.amountPaid).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            ` : `
            <div style="text-align: center; padding: 10px; color: #000; font-weight: bold;">
              ✓ Pago Completo
            </div>
            `}
            ` : ''}
          </div>

          ${sale.notes ? `
          <div class="section">
            <div class="section-title">Notas</div>
            <div style="padding: 10px; background-color: #f9f9f9; border-left: 3px solid #000;">
              ${sale.notes}
            </div>
          </div>
          ` : ''}

          <div class="footer">
            <p>McLeon - Sistema de Gestión de Ventas</p>
            <p>Documento generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank', 'width=800,height=900');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 250);
        };
      }
    };

    useImperativeHandle(ref, () => ({
      print: handlePrint
    }));

    return <div ref={printRef} style={{ display: 'none' }} />;
  }
);

PrintSale.displayName = 'PrintSale';
