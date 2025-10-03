import { useRef, useImperativeHandle, forwardRef } from 'react';
import { EMISOR_CONFIG } from '../constants/afipConstants';

// Tipos para los datos del comprobante
interface PrintVoucherData {
  // Datos del comprobante
  cbteTipo: number;
  ptoVta: number;
  cbteDesde?: number;
  cbteHasta?: number;
  cbteFch: string;
  cae?: string;
  vencimiento?: string;
  
  // Datos del receptor
  docTipo: number;
  docNro: string;
  nombreReceptor: string;
  
  // Importes
  impNeto: number;
  impIVA: number;
  impTotal: number;
  
  // Detalle IVA
  iva: Array<{
    Id: number;
    BaseImp: number;
    Importe: number;
    productName?: string;
  }>;
  
  // Datos adicionales
  monId: string;
  monCotiz: number;
}

interface PrintVoucherProps {
  data: PrintVoucherData;
  className?: string;
}

// Función para obtener el nombre del tipo de comprobante
const getTipoComprobanteNombre = (tipo: number): string => {
  switch (tipo) {
    case 1: return 'FACTURA A';
    case 6: return 'FACTURA B';
    case 11: return 'FACTURA C';
    default: return 'COMPROBANTE';
  }
};

// Función para obtener el nombre del tipo de documento
const getTipoDocumentoNombre = (tipo: number): string => {
  switch (tipo) {
    case 80: return 'CUIT';
    case 86: return 'CUIL';
    case 96: return 'DNI';
    case 99: return 'CF';
    default: return 'DOC';
  }
};

// Función para formatear fecha
const formatearFecha = (fechaString: string): string => {
  if (fechaString.length === 8) {
    const year = fechaString.substring(0, 4);
    const month = fechaString.substring(4, 6);
    const day = fechaString.substring(6, 8);
    return `${day}/${month}/${year}`;
  }
  return fechaString;
};

export interface PrintVoucherRef {
  print: () => void;
}

export const PrintVoucher = forwardRef<PrintVoucherRef, PrintVoucherProps>(
  ({ data, className = "" }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
      if (printRef.current) {
        // Crear el contenido HTML completo
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Comprobante AFIP - ${getTipoComprobanteNombre(data.cbteTipo)}</title>
            <meta charset="UTF-8">
            <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.4;
                  color: #000;
                  background: white;
                }
                .comprobante {
                  max-width: 210mm;
                  margin: 0 auto;
                  padding: 10mm;
                }
                .header {
                  text-align: center;
                  border-bottom: 2px solid #000;
                  padding-bottom: 10px;
                  margin-bottom: 10px;
                }
                .empresa {
                  font-size: 16px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .cuit-empresa {
                  font-size: 14px;
                  margin-bottom: 10px;
                }
                .tipo-comprobante {
                  font-size: 18px;
                  font-weight: bold;
                  border: 2px solid #000;
                  padding: 8px;
                  margin: 10px 0;
                }
                .datos-comprobante {
                  display: flex;
                  justify-content: space-between;
                  margin: 15px 0;
                  border-top: 1px solid #000;
                  border-bottom: 1px solid #000;
                  padding: 10px 0;
                }
                .datos-cliente {
                  margin: 15px 0;
                  border-bottom: 1px solid #000;
                  padding-bottom: 10px;
                }
                .detalle {
                  margin: 15px 0;
                }
                .detalle-item {
                  display: flex;
                  justify-content: space-between;
                  padding: 5px 0;
                  border-bottom: 1px dotted #ccc;
                }
                .totales {
                  margin-top: 20px;
                  border-top: 2px solid #000;
                  padding-top: 10px;
                }
                .total-final {
                  font-size: 16px;
                  font-weight: bold;
                  text-align: right;
                  border: 2px solid #000;
                  padding: 10px;
                  margin-top: 10px;
                }
                .cae-info {
                  margin-top: 20px;
                  border-top: 1px solid #000;
                  padding-top: 10px;
                  font-size: 11px;
                }
                @media print {
                  body { print-color-adjust: exact; }
                  .no-print { display: none !important; }
                }
                @page { 
                  margin: 0.5in;
                  size: A4;
                  /* Ocultar URL en pie de página */
                  @bottom-left {
                    content: "";
                  }
                  @bottom-right {
                    content: "";
                  }
                  @bottom-center {
                    content: "";
                  }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
            </html>
        `;

        // Crear ventana de impresión
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        
        if (printWindow) {
          // Escribir contenido y configurar la ventana
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // Cambiar el título de la ventana para ocultar about:blank
          printWindow.document.title = `Comprobante AFIP - ${getTipoComprobanteNombre(data.cbteTipo)}`;
          
          // Esperar un momento para que se renderice el contenido
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            
            // Cerrar la ventana después de un delay para dar tiempo a la impresión
            setTimeout(() => {
              printWindow.close();
            }, 500);
          }, 500);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      print: handlePrint
    }));

    return (
      <div className={`${className}`} style={{ display: 'none' }}>
        {/* Contenido para imprimir - OCULTO EN PANTALLA */}
        <div ref={printRef} className="comprobante">
          {/* Header */}
          <div className="header">
            <div className="empresa">{EMISOR_CONFIG.RAZON_SOCIAL}</div>
            <div className="cuit-empresa">CUIT: {EMISOR_CONFIG.CUIT}</div>
            <div className="tipo-comprobante">
              {getTipoComprobanteNombre(data.cbteTipo)}
            </div>
          </div>

          {/* Datos del comprobante */}
          <div className="datos-comprobante">
            <div>
              <strong>Punto de Venta:</strong> {data.ptoVta.toString().padStart(4, '0')}<br/>
              <strong>Número:</strong> {data.cbteDesde || '0000'} - {data.cbteHasta || '0000'}<br/>
              <strong>Fecha:</strong> {formatearFecha(data.cbteFch)}
            </div>
            <div>
              <strong>Moneda:</strong> {data.monId}<br/>
              <strong>Cotización:</strong> {data.monCotiz}
              {data.cae && (
                <>
                  <br/><strong>CAE:</strong> {data.cae}
                </>
              )}
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="datos-cliente">
            <strong>DATOS DEL RECEPTOR</strong><br/>
            <strong>Nombre/Razón Social:</strong> {data.nombreReceptor}<br/>
            <strong>Tipo Doc:</strong> {getTipoDocumentoNombre(data.docTipo)} <strong>Número:</strong> {data.docNro}
          </div>

          {/* Detalle de productos */}
          <div className="detalle">
            <strong>DETALLE DE PRODUCTOS/SERVICIOS</strong><br/>
            <div style={{ marginTop: '10px' }}>
              {data.iva.map((item, index) => (
                <div key={index} className="detalle-item">
                  <span>{item.productName || `Producto ${index + 1}`}</span>
                  <span>$ {item.BaseImp.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle IVA */}
          <div className="detalle">
            <strong>DETALLE IVA</strong><br/>
            <div style={{ marginTop: '10px' }}>
              {data.iva.map((item, index) => (
                <div key={index} className="detalle-item">
                  <span>IVA 21% - Base: $ {item.BaseImp.toFixed(2)}</span>
                  <span>$ {item.Importe.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="totales">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span><strong>Subtotal Neto:</strong></span>
              <span>$ {data.impNeto.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span><strong>IVA Total:</strong></span>
              <span>$ {data.impIVA.toFixed(2)}</span>
            </div>
            
            <div className="total-final">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>TOTAL:</span>
                <span>$ {data.impTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Información CAE */}
          {data.cae && (
            <div className="cae-info">
              <strong>COMPROBANTE AUTORIZADO</strong><br/>
              CAE: {data.cae}<br/>
              {data.vencimiento && (
                <>Fecha Vto CAE: {formatearFecha(data.vencimiento)}<br/></>
              )}
              Este comprobante fue autorizado por AFIP
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '10px', borderTop: '1px solid #000', paddingTop: '10px' }}>
            Comprobante generado electrónicamente - Sistema de Facturación
          </div>
        </div>
      </div>
    );
  }
);

PrintVoucher.displayName = 'PrintVoucher';