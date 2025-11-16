import { useRef, useImperativeHandle, forwardRef } from 'react';
import { IProductPopulated } from '@/types';
import { ISupplier } from '@/types/supplier';

interface ProductsBySupplier {
  supplier: ISupplier;
  products: IProductPopulated[];
}

interface PrintProductsBySupplierProps {
  data: ProductsBySupplier[];
  className?: string;
}

export interface PrintProductsBySupplierRef {
  print: () => void;
}

const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 0.5cm;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
    line-height: 1.3;
    color: #000;
    background: white;
  }

  .page-container {
    width: 100%;
    max-width: 21cm;
    margin: 0 auto;
    padding: 0.5cm;
    background: white;
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #333;
    page-break-after: always;
  }

  .header h1 {
    font-size: 18pt;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .header .date {
    font-size: 10pt;
    color: #666;
  }

  .supplier-section {
    page-break-before: always;
    page-break-after: always;
    min-height: 90vh;
  }

  .supplier-header {
    background-color: #f0f0f0;
    padding: 10px;
    margin-bottom: 10px;
    border-left: 4px solid #333;
  }

  .supplier-name {
    font-size: 14pt;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .supplier-info {
    font-size: 9pt;
    color: #666;
  }

  .products-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }

  .products-table thead {
    background-color: #333;
    color: white;
  }

  .products-table th {
    padding: 8px;
    text-align: left;
    font-weight: bold;
    font-size: 9pt;
    border: 1px solid #333;
  }

  .products-table td {
    padding: 6px 8px;
    border: 1px solid #ddd;
    font-size: 9pt;
  }

  .products-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .products-table tbody tr:hover {
    background-color: #f0f0f0;
  }

  .text-right {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }

  .summary {
    margin-top: 5px;
    padding: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-weight: bold;
  }

  .no-products {
    text-align: center;
    padding: 20px;
    color: #999;
    font-style: italic;
  }

  @media print {
    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    .header {
      page-break-after: avoid;
      display: none;
    }

    .supplier-section {
      page-break-before: always;
      page-break-after: always;
      page-break-inside: avoid;
    }

    .supplier-section:first-of-type {
      page-break-before: auto;
    }

    .products-table {
      page-break-inside: auto;
    }

    .products-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    .products-table thead {
      display: table-header-group;
    }
  }
`;

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(value);
};

const getCategoryName = (category: any): string => {
  if (!category) return '-';
  if (typeof category === 'string') return category;
  if (category.name) return category.name;
  if (category._id && typeof category._id === 'object' && category._id.name) return category._id.name;
  return '-';
};

const renderSupplierSection = (supplierData: ProductsBySupplier, index: number): string => {
  const { supplier, products } = supplierData;
  
  const productsHtml = products.length > 0 ? products.map(product => `
    <tr>
      <td>${product.productCode}</td>
      <td>${product.name}</td>
      <td class="text-center">${product.currentStock}</td>
      <td class="text-center">${getCategoryName(product.category)}</td>
      <td class="text-right">${formatCurrency(product.purchaseCost)}</td>
      <td class="text-right">${formatCurrency(product.wholesalePrice)}</td>
      <td class="text-right">${formatCurrency(product.retailPrice)}</td>
    </tr>
  `).join('') : `
    <tr>
      <td colspan="7" class="no-products">No hay productos asociados a este proveedor</td>
    </tr>
  `;

  return `
    <div class="supplier-section" style="${index === 0 ? 'page-break-before: auto;' : ''}">
      <div class="supplier-header">
        <div class="supplier-name">${supplier.name}</div>
        <div class="supplier-info">
          ${supplier.email ? `Email: ${supplier.email}` : ''} 
          ${supplier.phone ? `| Tel: ${supplier.phone}` : ''} 
          ${supplier.location ? `| ${supplier.location}` : ''}
        </div>
      </div>
      
      <table class="products-table">
        <thead>
          <tr>
            <th style="width: 15%;">Código</th>
            <th style="width: 30%;">Nombre</th>
            <th style="width: 10%;" class="text-center">Stock</th>
            <th style="width: 12%;" class="text-center">Categoría</th>
            <th style="width: 15%;" class="text-right">Costo</th>
            <th style="width: 15%;" class="text-right">Mayorista</th>
            <th style="width: 15%;" class="text-right">Minorista</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>
    </div>
  `;
};

export const PrintProductsBySupplier = forwardRef<PrintProductsBySupplierRef, PrintProductsBySupplierProps>(
  ({ data, className = "" }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
      if (!data || data.length === 0) {
        alert('No hay datos para imprimir');
        return;
      }

      const fileName = `Productos_por_Proveedores_${new Date().toISOString().split('T')[0]}.pdf`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${fileName}</title>
          <meta charset="UTF-8">
          <style>${PRINT_STYLES}</style>
        </head>
        <body>
          <div class="page-container">
            ${data.map((item, index) => renderSupplierSection(item, index)).join('')}
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank', 'width=900,height=900');
      
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.document.title = fileName;
        
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => printWindow.close(), 1000);
        }, 500);
      }
    };

    useImperativeHandle(ref, () => ({
      print: handlePrint
    }));

    return (
      <div ref={printRef} className={className} style={{ display: 'none' }}>
        {/* Componente oculto - solo para referencia */}
      </div>
    );
  }
);

PrintProductsBySupplier.displayName = 'PrintProductsBySupplier';
