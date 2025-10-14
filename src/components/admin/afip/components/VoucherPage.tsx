import React from 'react';
import { VoucherHeader } from './VoucherHeader';
import { ClientInfo } from './ClientInfo';
import { ProductsTable } from './ProductsTable';
import { VoucherTotals } from './VoucherTotals';
import { CAEInfo } from './CAEInfo';

interface PrintVoucherData {
  cbteTipo: number;
  ptoVta: number;
  cbteDesde?: number;
  cbteHasta?: number;
  cbteFch: string;
  cae?: string;
  vencimiento?: string;
  docTipo: number;
  docNro: string;
  nombreReceptor: string;
  direccionReceptor?: string;
  impNeto: number;
  impIVA: number;
  impTotal: number;
  iva: Array<{
    Id: number;
    BaseImp: number;
    Importe: number;
    productName?: string;
    productCode?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
  monId: string;
  monCotiz: number;
  paymentMethod?: string;
}

interface VoucherPageProps {
  data: PrintVoucherData;
  tipo: 'ORIGINAL' | 'DUPLICADO';
  pageBreak?: boolean;
}

export const VoucherPage: React.FC<VoucherPageProps> = ({ 
  data, 
  tipo, 
  pageBreak = false 
}) => {
  return (
    <div 
      className="comprobante" 
      style={{ pageBreakAfter: pageBreak ? 'always' : 'auto' }}
    >
      <VoucherHeader
        cbteTipo={data.cbteTipo}
        ptoVta={data.ptoVta}
        cbteDesde={data.cbteDesde}
        tipo={tipo}
      />

      <ClientInfo
        nombreReceptor={data.nombreReceptor}
        direccionReceptor={data.direccionReceptor}
        docTipo={data.docTipo}
        docNro={data.docNro}
        cbteFch={data.cbteFch}
        cbteTipo={data.cbteTipo}
      />

      <ProductsTable iva={data.iva} />

      <VoucherTotals
        impNeto={data.impNeto}
        impIVA={data.impIVA}
        impTotal={data.impTotal}
        paymentMethod={data.paymentMethod}
      />

      <CAEInfo
        cae={data.cae}
        vencimiento={data.vencimiento}
      />
    </div>
  );
};