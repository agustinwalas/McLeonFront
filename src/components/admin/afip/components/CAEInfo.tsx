import React from 'react';
import { formatearFecha } from '../utils/printVoucherUtils';

interface CAEInfoProps {
  cae?: string;
  vencimiento?: string;
}

export const CAEInfo: React.FC<CAEInfoProps> = ({ cae, vencimiento }) => {
  if (!cae) return null;

  return (
    <div style={{ marginTop: '30px', fontSize: '10px', borderTop: '1px solid #000', paddingTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>CAE Nº:</strong> {cae}
        </div>
        <div>
          <strong>Fecha Vto.:</strong> {vencimiento ? formatearFecha(vencimiento) : ''}
        </div>
      </div>
    </div>
  );
};