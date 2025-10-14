import React from 'react';
import { numeroALetras } from '../utils/printVoucherUtils';

interface VoucherTotalsProps {
  impNeto: number;
  impIVA: number;
  impTotal: number;
  paymentMethod?: string;
}

export const VoucherTotals: React.FC<VoucherTotalsProps> = ({
  impNeto,
  impIVA,
  impTotal,
  paymentMethod
}) => {
  return (
    <div style={{ borderTop: '1px solid #000', paddingTop: '15px' }}>
      {/* Número en letras */}
      <div style={{ fontSize: '11px', marginBottom: '30px', textAlign: 'center' }}>
        Son Pesos: <strong>{numeroALetras(impTotal)}</strong>
      </div>

      {/* Forma de pago y subtotal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
        <div>Forma de Pago: {paymentMethod || 'Cuenta Corriente'}</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '3px' }}>
            <span>SUBTOTAL</span>
            <span style={{ marginLeft: '50px' }}>{impNeto.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Detalle de totales */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
        <div>
          <div><strong>GRAVADO</strong></div>
          <div style={{ marginTop: '3px' }}>{impNeto.toFixed(2)}</div>
        </div>
        <div>
          <div><strong>EXENTO</strong></div>
        </div>
        <div>
          <div><strong>IVA 21%</strong></div>
          <div style={{ marginTop: '3px' }}>{impIVA.toFixed(2)}</div>
        </div>
        <div>
          <div><strong>I. BRUTOS</strong></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>TOTAL</strong></div>
          <div style={{ marginTop: '3px', fontSize: '14px', fontWeight: 'bold' }}>
            {impTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};