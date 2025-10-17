import React from 'react';
import { formatearCantidad } from '../utils/printVoucherUtils';

interface ProductItem {
  Id: number;
  BaseImp: number;
  Importe: number;
  productName?: string;
  productCode?: string;
  quantity?: number;
  unitPrice?: number;
}

interface ProductsTableProps {
  iva: ProductItem[];
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ iva }) => {
  return (
    <>
      {/* Orden de Compra */}
      <div style={{ marginBottom: '15px', fontSize: '11px' }}>
        <strong>Orden de Compra</strong>
      </div>

      {/* Tabla de productos */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '11px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #000' }}>
            <th style={{ textAlign: 'left', padding: '5px' }}>Cód.</th>
            <th style={{ textAlign: 'left', padding: '5px' }}>Descripción</th>
            <th style={{ textAlign: 'center', padding: '5px' }}>Cantidad</th>
            <th style={{ textAlign: 'right', padding: '5px' }}>Pr. Unitario</th>
            <th style={{ textAlign: 'right', padding: '5px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {iva.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '8px 5px' }}>
                {item.productCode || `PRE${index + 1}`}
              </td>
              <td style={{ padding: '8px 5px' }}>
                {item.productName || 'PRODUCTO'}
              </td>
              <td style={{ textAlign: 'center', padding: '8px 5px' }}>
                {formatearCantidad(item.quantity)}
              </td>
              <td style={{ textAlign: 'right', padding: '8px 5px' }}>
                {item.unitPrice?.toFixed(2) || '0.00'}
              </td>
              <td style={{ textAlign: 'right', padding: '8px 5px' }}>
                {(item.BaseImp + item.Importe).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};