import { useRef, useImperativeHandle, forwardRef } from 'react';
import { generarNombreArchivo } from '../utils/printVoucherUtils';
import { renderVoucherPageAsString } from '../utils/voucherRenderer';
import { PRINT_STYLES, ADDITIONAL_PRINT_STYLES, TITLE_OVERRIDE_STYLES } from '../styles/printStyles';

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


export interface PrintVoucherRef {
  print: () => void;
}

export const PrintVoucher = forwardRef<PrintVoucherRef, PrintVoucherProps>(
  ({ data, className = "" }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
      if (printRef.current) {
        // Generar nombre de archivo sugerido
        const fileName = generarNombreArchivo(
          data.cbteDesde, 
          data.ptoVta, 
          data.nombreReceptor, 
          data.cbteTipo
        );
        
        // Crear el contenido HTML completo con dos hojas
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${fileName}</title>
            <meta charset="UTF-8">
            <style>${PRINT_STYLES}</style>
          </head>
          <body>
            <!-- Overlay superior para cubrir header del navegador -->
            <div style="position: fixed; top: -1in; left: -1in; right: -1in; height: 1in; background: white; z-index: 9998;"></div>
            
            <!-- Overlay inferior para cubrir footer del navegador -->
            <div style="position: fixed; bottom: -1in; left: -1in; right: -1in; height: 1in; background: white; z-index: 9998;"></div>
            
            <!-- Contenido principal -->
            <div style="position: relative; z-index: 9999; background: white; min-height: 100vh;">
              <div class="comprobante" style="page-break-after: always;">
                ${renderVoucherPageAsString(data, 'ORIGINAL')}
              </div>
              <div class="comprobante">
                ${renderVoucherPageAsString(data, 'DUPLICADO')}
              </div>
            </div>
          </body>
          </html>
        `;

        // Crear ventana de impresión
        const printWindow = window.open('', '_blank', 'width=800,height=900,scrollbars=no,resizable=no');
        
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.document.title = fileName;
          
          // Agregar estilos adicionales
          const additionalStyles = printWindow.document.createElement('style');
          additionalStyles.innerHTML = ADDITIONAL_PRINT_STYLES;
          printWindow.document.head.appendChild(additionalStyles);
          
          const titleStyles = printWindow.document.createElement('style');
          titleStyles.innerHTML = TITLE_OVERRIDE_STYLES;
          printWindow.document.head.appendChild(titleStyles);
          
          // Configuración final antes de imprimir
          setTimeout(() => {
            try {
              const metaNoHeader = printWindow.document.createElement('meta');
              metaNoHeader.name = 'print-header';
              metaNoHeader.content = '';
              printWindow.document.head.appendChild(metaNoHeader);
              
              const metaNoFooter = printWindow.document.createElement('meta');
              metaNoFooter.name = 'print-footer';
              metaNoFooter.content = '';
              printWindow.document.head.appendChild(metaNoFooter);
              
              printWindow.document.title = ' ';
            } catch {
              console.log('No se pudo configurar meta tags de impresión');
            }
            
            printWindow.focus();
            console.log('💡 Si aún aparecen headers/footers:');
            console.log('   Chrome/Edge: Más opciones → Desmarcar "Encabezados y pies de página"');
            console.log('   Firefox: Archivo → Configurar página → Desmarcar headers/footers');
            
            printWindow.print();
            setTimeout(() => printWindow.close(), 1000);
          }, 800);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      print: handlePrint
    }));

    return (
      <div className={`${className}`} style={{ display: 'none' }}>
        {/* El contenido visual se maneja en la función de impresión */}
        <div ref={printRef} />
      </div>
    );
  }
);

PrintVoucher.displayName = 'PrintVoucher';