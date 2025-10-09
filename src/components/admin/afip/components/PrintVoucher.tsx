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
  direccionReceptor?: string;
  
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
    productCode?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
  
  // Datos adicionales
  monId: string;
  monCotiz: number;
  paymentMethod?: string;
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

    // Función helper para generar el contenido del comprobante
    const generateComprobanteContent = (tipo: 'ORIGINAL' | 'DUPLICADO') => {
      return `
        <div class="comprobante" style="page-break-after: ${tipo === 'ORIGINAL' ? 'always' : 'auto'};">
          <!-- Header - Datos del emisor y receptor en dos columnas -->
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
                <th style="text-align: right; padding: 5px;">Pr. Unitario</th>
                <th style="text-align: right; padding: 5px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.iva.map((item, index) => `
                <tr>
                  <td style="padding: 8px 5px;">${item.productCode || `PRE${index + 1}`}</td>
                  <td style="padding: 8px 5px;">${item.productName || 'PRODUCTO'}</td>
                  <td style="text-align: center; padding: 8px 5px;">
                    ${item.quantity 
                      ? (item.quantity % 1 === 0 
                          ? item.quantity.toString() 
                          : item.quantity.toFixed(2).replace(/\.?0+$/, ''))
                      : '1.00'}
                  </td>
                  <td style="text-align: right; padding: 8px 5px;">
                    ${item.unitPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td style="text-align: right; padding: 8px 5px;">
                    ${item.BaseImp.toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Totales -->
          <div style="border-top: 1px solid #000; padding-top: 15px;">
            <div style="font-size: 11px; margin-bottom: 30px; text-align: center;">
              Son Pesos: <strong>${(() => {
                const numeroALetras = (num: number): string => {
                  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
                  const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
                  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
                  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
                
                  const entero = Math.floor(num);
                  const decimales = Math.round((num - entero) * 100);
                
                  const convertirGrupo = (n: number): string => {
                    if (n === 0) return '';
                    if (n < 10) return unidades[n];
                    if (n < 20) return especiales[n - 10];
                    if (n < 100) {
                      const dec = Math.floor(n / 10);
                      const uni = n % 10;
                      return decenas[dec] + (uni > 0 ? ' Y ' + unidades[uni] : '');
                    }
                    const cen = Math.floor(n / 100);
                    const resto = n % 100;
                    return (n === 100 ? 'CIEN' : centenas[cen]) + (resto > 0 ? ' ' + convertirGrupo(resto) : '');
                  };
                
                  const convertirMiles = (n: number): string => {
                    if (n === 0) return 'CERO';
                    if (n < 1000) return convertirGrupo(n);
                    
                    const miles = Math.floor(n / 1000);
                    const resto = n % 1000;
                    
                    let resultado = '';
                    if (miles === 1) {
                      resultado = 'MIL';
                    } else {
                      resultado = convertirGrupo(miles) + ' MIL';
                    }
                    
                    if (resto > 0) {
                      resultado += ' ' + convertirGrupo(resto);
                    }
                    
                    return resultado;
                  };
                
                  let resultado = convertirMiles(entero);
                  resultado += ` CON ${decimales.toString().padStart(2, '0')}/100`;
                  
                  return resultado;
                };
                return numeroALetras(data.impTotal);
              })()}</strong>
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
        </div>
      `;
    };

    const handlePrint = () => {
      if (printRef.current) {
        // Crear nombre de archivo sugerido
        const numeroFactura = data.cbteDesde ? 
          `${data.ptoVta.toString().padStart(5, '0')}-${data.cbteDesde.toString().padStart(8, '0')}` : 
          'SN';
        const nombreReceptor = data.nombreReceptor
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
          .replace(/\s+/g, '-') // Reemplazar espacios con guiones
          .substring(0, 20); // Limitar longitud
        const tipoFactura = data.cbteTipo === 1 ? 'A' : data.cbteTipo === 6 ? 'B' : 'C';
        const fileName = `FAC-${tipoFactura}-${numeroFactura}-${nombreReceptor}`;
        
        // Crear el contenido HTML completo con dos hojas
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
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 11px;
                  line-height: 1.4;
                  color: #000;
                  background: white;
                }
                .comprobante {
                  max-width: 210mm;
                  margin: 0 auto;
                  padding: 15mm;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th {
                  font-weight: normal;
                  text-align: left;
                }
                strong {
                  font-weight: bold;
                }
                @media print {
                  body { 
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                  }
                  .no-print { display: none !important; }
                  
                  /* Ocultar completamente headers y footers del navegador */
                  @page {
                    margin: 0.5in;
                    size: A4;
                    
                    /* Eliminar headers */
                    @top-left { content: ""; }
                    @top-center { content: ""; }
                    @top-right { content: ""; }
                    
                    /* Eliminar footers */
                    @bottom-left { content: ""; }
                    @bottom-center { content: ""; }
                    @bottom-right { content: ""; }
                  }
                  
                  /* Alternativa adicional para navegadores que no respetan @page */
                  html, body {
                    overflow: hidden;
                  }
                  
                  /* Forzar que no se muestren URLs, títulos, fechas */
                  * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                }
              </style>
            </head>
            <body>
              ${generateComprobanteContent('ORIGINAL')}
              ${generateComprobanteContent('DUPLICADO')}
            </body>
            </html>
        `;

        // Crear ventana de impresión con configuración específica
        const printWindow = window.open('', '_blank', 'width=800,height=900,scrollbars=no,resizable=no');
        
        if (printWindow) {
          // Escribir contenido y configurar la ventana
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // Cambiar el título de la ventana para sugerir nombre de archivo
          printWindow.document.title = fileName;
          
          // Configurar la ventana para ocultar headers y footers
          const style = printWindow.document.createElement('style');
          style.innerHTML = `
            @media print {
              @page {
                margin: 0.5in;
                size: A4;
                /* Forzar que no aparezcan headers/footers */
                -webkit-print-color-adjust: exact;
                
                /* Método alternativo: hacer invisible el contenido de headers/footers */
                @top-left-corner { content: ""; color: transparent; }
                @top-left { content: ""; color: transparent; }
                @top-center { content: ""; color: transparent; }
                @top-right { content: ""; color: transparent; }
                @top-right-corner { content: ""; color: transparent; }
                
                @bottom-left-corner { content: ""; color: transparent; }
                @bottom-left { content: ""; color: transparent; }
                @bottom-center { content: ""; color: transparent; }
                @bottom-right { content: ""; color: transparent; }
                @bottom-right-corner { content: ""; color: transparent; }
              }
              
              /* Ocultar cualquier elemento que pueda contener URL */
              body::before, body::after {
                content: "" !important;
                display: none !important;
              }
            }
          `;
          printWindow.document.head.appendChild(style);
          
          // Intentar configurar la impresión sin headers/footers (Chrome/Edge)
          if ('onbeforeprint' in printWindow) {
            printWindow.onbeforeprint = function() {
              // Configurar impresión sin headers/footers si el navegador lo soporta
              if (printWindow.matchMedia) {
                const mediaQueryList = printWindow.matchMedia('print');
                if (mediaQueryList.matches) {
                  // Está en modo de impresión
                  return;
                }
              }
            };
          }
          
          // Esperar un momento para que se renderice el contenido
          setTimeout(() => {
            printWindow.focus();
            
            // Mostrar mensaje al usuario sobre configuración de impresora
            console.log('💡 Consejo: Para eliminar completamente headers/footers, en las opciones de impresión desactiva "Encabezados y pies de página"');
            
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
          {/* Header - Datos del emisor y receptor en dos columnas */}
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
                {getTipoComprobanteNombre(data.cbteTipo)}
              </div>
              <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                Original
              </div>
              <div style={{ fontSize: '11px' }}>
                {data.cbteDesde ? `A-${data.ptoVta.toString().padStart(5, '0')}-${data.cbteDesde.toString().padStart(8, '0')}` : ''}
              </div>
            </div>
          </div>

          {/* Datos del receptor */}
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ width: '70%' }}>
                <div style={{ fontSize: '14px', marginBottom: '3px' }}>
                  <strong>{data.nombreReceptor}</strong>
                </div>
                {data.direccionReceptor && (
                  <div style={{ fontSize: '11px' }}>
                    {data.direccionReceptor}
                  </div>
                )}
              </div>
              <div style={{ width: '28%', textAlign: 'right', fontSize: '11px' }}>
                Cod: {data.cbteTipo === 1 ? '12,308' : data.cbteTipo === 6 ? '12,309' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div>
                {getTipoDocumentoNombre(data.docTipo)}: {data.docNro}
              </div>
              <div>
                {formatearFecha(data.cbteFch)}
              </div>
            </div>
            <div style={{ fontSize: '11px', marginTop: '3px' }}>
              {data.cbteTipo === 1 ? 'IVA Responsable Inscripto' : ''}
            </div>
          </div>

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
              {data.iva.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px 5px' }}>{item.productCode || `PRE${index + 1}`}</td>
                  <td style={{ padding: '8px 5px' }}>{item.productName || 'PRODUCTO'}</td>
                  <td style={{ textAlign: 'center', padding: '8px 5px' }}>
                    {item.quantity 
                      ? (item.quantity % 1 === 0 
                          ? item.quantity.toString() 
                          : item.quantity.toFixed(2).replace(/\.?0+$/, ''))
                      : '1.00'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px 5px' }}>
                    {item.unitPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px 5px' }}>
                    {item.BaseImp.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totales */}
          <div style={{ borderTop: '1px solid #000', paddingTop: '15px' }}>
            <div style={{ fontSize: '11px', marginBottom: '30px', textAlign: 'center' }}>
              Son Pesos: <strong>{(() => {
                const numeroALetras = (num: number): string => {
                  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
                  const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
                  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
                  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
                
                  const entero = Math.floor(num);
                  const decimales = Math.round((num - entero) * 100);
                
                  const convertirGrupo = (n: number): string => {
                    if (n === 0) return '';
                    if (n < 10) return unidades[n];
                    if (n < 20) return especiales[n - 10];
                    if (n < 100) {
                      const dec = Math.floor(n / 10);
                      const uni = n % 10;
                      return decenas[dec] + (uni > 0 ? ' Y ' + unidades[uni] : '');
                    }
                    const cen = Math.floor(n / 100);
                    const resto = n % 100;
                    return (n === 100 ? 'CIEN' : centenas[cen]) + (resto > 0 ? ' ' + convertirGrupo(resto) : '');
                  };
                
                  const convertirMiles = (n: number): string => {
                    if (n === 0) return 'CERO';
                    if (n < 1000) return convertirGrupo(n);
                    
                    const miles = Math.floor(n / 1000);
                    const resto = n % 1000;
                    
                    let resultado = '';
                    if (miles === 1) {
                      resultado = 'MIL';
                    } else {
                      resultado = convertirGrupo(miles) + ' MIL';
                    }
                    
                    if (resto > 0) {
                      resultado += ' ' + convertirGrupo(resto);
                    }
                    
                    return resultado;
                  };
                
                  let resultado = convertirMiles(entero);
                  resultado += ` CON ${decimales.toString().padStart(2, '0')}/100`;
                  
                  return resultado;
                };
                return numeroALetras(data.impTotal);
              })()}</strong>
            </div>
      
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
              <div>Forma de Pago: {data.paymentMethod || 'Cuenta Corriente'}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '3px' }}>
                  <span>SUBTOTAL</span>
                  <span style={{ marginLeft: '50px' }}>{data.impNeto.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
              <div>
                <div><strong>GRAVADO</strong></div>
                <div style={{ marginTop: '3px' }}>{data.impNeto.toFixed(2)}</div>
              </div>
              <div>
                <div><strong>EXENTO</strong></div>
              </div>
              <div>
                <div><strong>IVA 21%</strong></div>
                <div style={{ marginTop: '3px' }}>{data.impIVA.toFixed(2)}</div>
              </div>
              <div>
                <div><strong>I. BRUTOS</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>TOTAL</strong></div>
                <div style={{ marginTop: '3px', fontSize: '14px', fontWeight: 'bold' }}>
                  {data.impTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* CAE Info */}
          {data.cae && (
            <div style={{ marginTop: '30px', fontSize: '10px', borderTop: '1px solid #000', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>CAE Nº:</strong> {data.cae}
                </div>
                <div>
                  <strong>Fecha Vto.:</strong> {data.vencimiento ? formatearFecha(data.vencimiento) : ''}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PrintVoucher.displayName = 'PrintVoucher';