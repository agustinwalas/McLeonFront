import { EMISOR_CONFIG } from '../constants/afipConstants';
import { 
  getTipoComprobanteNombre, 
  getTipoDocumentoNombre, 
  formatearFecha,
  numeroALetras,
  formatearCantidad
} from './printVoucherUtils';

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

// Función para renderizar una página de comprobante como string HTML
export const renderVoucherPageAsString = (
  data: PrintVoucherData, 
  tipo: 'ORIGINAL' | 'DUPLICADO'
): string => {
  // Si hay deliveryFee, agregarlo como un producto más
  let ivaWithDelivery = data.iva;
  if (typeof (data as any).deliveryFee === 'number' && (data as any).deliveryFee > 0) {
    const deliveryFee = (data as any).deliveryFee;
    ivaWithDelivery = [
      ...data.iva,
      {
        Id: 5, // o el ID de IVA correspondiente para servicios
        BaseImp: deliveryFee / 1.21,
        Importe: deliveryFee - deliveryFee / 1.21,
        productName: 'ENVÍO A DOMICILIO',
        productCode: 'ENVIO',
        quantity: 1,
        unitPrice: deliveryFee
      }
    ];
  }

  return `
    <!-- Header - Datos del emisor y receptor -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 15px;">
      <!-- Columna izquierda - Emisor -->
      <div style="width: 48%;">
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">
          ${EMISOR_CONFIG.RAZON_SOCIAL}
        </div>
        <div style="font-size: 11px; margin-bottom: 3px;">
          Av. Cabildo 1849, Local 43 CABA
        </div>
        <div style="font-size: 11px; margin-bottom: 3px;">Cp 1428</div>
        <div style="font-size: 11px; margin-bottom: 3px;">
          CUIT: ${EMISOR_CONFIG.CUIT}
        </div>
        <div style="font-size: 11px;">
          Responsable Inscripto
        </div>
      </div>

      <!-- Columna derecha - Tipo y número de comprobante -->
      <div style="width: 48%; text-align: right;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
          ${getTipoComprobanteNombre(data.cbteTipo)}
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          ${tipo}
        </div>
        <div style="font-size: 11px;">
          ${data.cbteDesde ? `A-${data.ptoVta.toString().padStart(5, '0')}-${data.cbteDesde.toString().padStart(8, '0')}` : ''}
        </div>
      </div>
    </div>

    <!-- Datos del receptor -->
    <div style="margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div style="width: 70%;">
          <div style="font-size: 14px; margin-bottom: 3px;">
            <strong>${data.nombreReceptor}</strong>
          </div>
          ${data.direccionReceptor ? `
            <div style="font-size: 11px; margin-bottom: 3px;">
              ${data.direccionReceptor}
            </div>
          ` : ''}
        </div>
        <div style="width: 28%; text-align: right; font-size: 11px;">
          Cod: ${data.cbteTipo === 1 ? '12,308' : data.cbteTipo === 6 ? '12,309' : ''}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px;">
        <div>
          ${getTipoDocumentoNombre(data.docTipo)}: ${data.docNro}
        </div>
        <div>
          ${formatearFecha(data.cbteFch)}
        </div>
      </div>
      <div style="font-size: 11px; margin-top: 3px;">
        ${data.cbteTipo === 1 ? 'IVA Responsable Inscripto' : ''}
      </div>
    </div>

    <!-- Orden de Compra -->
    <div style="margin-bottom: 15px; font-size: 11px;">
      <strong>Orden de Compra</strong>
    </div>

    <!-- Tabla de productos -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
      <thead>
        <tr style="border-bottom: 1px solid #000;">
          <th style="text-align: left; padding: 5px;">Cód.</th>
          <th style="text-align: left; padding: 5px;">Descripción</th>
          <th style="text-align: center; padding: 5px;">Cantidad</th>
          <th style="text-align: right; padding: 5px;">Base</th>
          <th style="text-align: right; padding: 5px;">Iva</th>
          <th style="text-align: right; padding: 5px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${ivaWithDelivery.map((item, index) => `
          <tr>
            <td style="padding: 8px 5px;">${item.productCode || `PRE${index + 1}`}</td>
            <td style="padding: 8px 5px;">${item.productName || 'PRODUCTO'}</td>
            <td style="text-align: center; padding: 8px 5px;">
              ${formatearCantidad(item.quantity)}
            </td>
            <td style="text-align: right; padding: 8px 5px;">
              ${(((item.unitPrice || 0) * (item.quantity || 0)) * 0.79).toFixed(2) }
            </td>
             <td style="text-align: right; padding: 8px 5px;">
              ${(((item.unitPrice || 0) * (item.quantity || 0)) * 0.21).toFixed(2) }
            </td>
            <td style="text-align: right; padding: 8px 5px;">
              ${((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totales -->
    <div style="border-top: 1px solid #000; padding-top: 15px;">
      <div style="font-size: 11px; margin-bottom: 30px; text-align: center;">
        Son Pesos: <strong>${numeroALetras(data.impTotal)}</strong>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
        <div>Forma de Pago: ${data.paymentMethod || 'Cuenta Corriente'}</div>
        <div style="text-align: right;">
          <div style="margin-bottom: 3px;">
            <span>SUBTOTAL</span>
            <span style="margin-left: 50px;">${data.impNeto.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
        <div>
          <div><strong>GRAVADO</strong></div>
          <div style="margin-top: 3px;">${data.impNeto.toFixed(2)}</div>
        </div>
        <div>
          <div><strong>EXENTO</strong></div>
        </div>
        <div>
          <div><strong>IVA 21%</strong></div>
          <div style="margin-top: 3px;">${data.impIVA.toFixed(2)}</div>
        </div>
        <div>
          <div><strong>I. BRUTOS</strong></div>
        </div>
        <div style="text-align: right;">
          <div><strong>TOTAL</strong></div>
          <div style="margin-top: 3px; font-size: 14px; font-weight: bold;">
            ${data.impTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>

    <!-- CAE Info -->
    ${data.cae ? `
      <div style="margin-top: 30px; font-size: 10px; border-top: 1px solid #000; padding-top: 10px;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <strong>CAE Nº:</strong> ${data.cae}
          </div>
          <div>
            <strong>Fecha Vto.:</strong> ${data.vencimiento ? formatearFecha(data.vencimiento) : ''}
          </div>
        </div>
      </div>
    ` : ''}
  `;
};