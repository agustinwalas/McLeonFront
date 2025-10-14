import React from 'react';
import { getTipoDocumentoNombre, formatearFecha } from '../utils/printVoucherUtils';

interface ClientInfoProps {
  nombreReceptor: string;
  direccionReceptor?: string;
  docTipo: number;
  docNro: string;
  cbteFch: string;
  cbteTipo: number;
}

export const ClientInfo: React.FC<ClientInfoProps> = ({
  nombreReceptor,
  direccionReceptor,
  docTipo,
  docNro,
  cbteFch,
  cbteTipo
}) => {
  return (
    <div style={{ marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ width: '70%' }}>
          <div style={{ fontSize: '14px', marginBottom: '3px' }}>
            <strong>{nombreReceptor}</strong>
          </div>
          {direccionReceptor && (
            <div style={{ fontSize: '11px', marginBottom: '3px' }}>
              {direccionReceptor}
            </div>
          )}
        </div>
        <div style={{ width: '28%', textAlign: 'right', fontSize: '11px' }}>
          Cod: {cbteTipo === 1 ? '12,308' : cbteTipo === 6 ? '12,309' : ''}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
        <div>
          {getTipoDocumentoNombre(docTipo)}: {docNro}
        </div>
        <div>
          {formatearFecha(cbteFch)}
        </div>
      </div>
      <div style={{ fontSize: '11px', marginTop: '3px' }}>
        {cbteTipo === 1 ? 'IVA Responsable Inscripto' : ''}
      </div>
    </div>
  );
};