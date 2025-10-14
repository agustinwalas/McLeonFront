import React from 'react';
import { EMISOR_CONFIG } from '../constants/afipConstants';
import { getTipoComprobanteNombre } from '../utils/printVoucherUtils';

interface VoucherHeaderProps {
  cbteTipo: number;
  ptoVta: number;
  cbteDesde?: number;
  tipo: 'ORIGINAL' | 'DUPLICADO';
}

export const VoucherHeader: React.FC<VoucherHeaderProps> = ({
  cbteTipo,
  ptoVta,
  cbteDesde,
  tipo
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '15px' }}>
      {/* Columna izquierda - Emisor */}
      <div style={{ width: '48%' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
          {EMISOR_CONFIG.RAZON_SOCIAL}
        </div>
        <div style={{ fontSize: '11px', marginBottom: '3px' }}>
          Av. Cabildo 1849, Local 43 CABA
        </div>
        <div style={{ fontSize: '11px', marginBottom: '3px' }}>Cp 1428</div>
        <div style={{ fontSize: '11px', marginBottom: '3px' }}>
          CUIT: {EMISOR_CONFIG.CUIT}
        </div>
        <div style={{ fontSize: '11px' }}>
          Responsable Inscripto
        </div>
      </div>

      {/* Columna derecha - Tipo y número de comprobante */}
      <div style={{ width: '48%', textAlign: 'right' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          {getTipoComprobanteNombre(cbteTipo)}
        </div>
        <div style={{ fontSize: '12px', marginBottom: '5px' }}>
          {tipo}
        </div>
        <div style={{ fontSize: '11px' }}>
          {cbteDesde ? `A-${ptoVta.toString().padStart(5, '0')}-${cbteDesde.toString().padStart(8, '0')}` : ''}
        </div>
      </div>
    </div>
  );
};