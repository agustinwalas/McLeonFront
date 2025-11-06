import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Note, NoteType } from '@/types/note';
import { PRINT_STYLES, ADDITIONAL_PRINT_STYLES, TITLE_OVERRIDE_STYLES } from '../afip/styles/printStyles';
import { EMISOR_CONFIG } from '../afip/constants/afipConstants';
import { 
  formatearFecha,
  numeroALetras,
  formatearCantidad
} from '../afip/utils/printVoucherUtils';

interface PrintNoteProps {
  note: Note;
  className?: string;
}

export interface PrintNoteRef {
  print: () => void;
}

// Función para obtener el nombre del tipo de nota
const getTipoNotaNombre = (cbteTipo: number): string => {
  const tipos: Record<number, string> = {
    2: 'NOTA DE DÉBITO A',
    3: 'NOTA DE CRÉDITO A',
    7: 'NOTA DE DÉBITO B',
    8: 'NOTA DE CRÉDITO B',
    12: 'NOTA DE DÉBITO C',
    13: 'NOTA DE CRÉDITO C',
  };
  return tipos[cbteTipo] || 'NOTA';
};

// Función para generar el nombre del archivo
const generarNombreArchivo = (note: Note): string => {
  const tipo = note.noteType === NoteType.CREDITO ? 'NC' : 'ND';
  const numero = note.noteNumber?.replace('-', '_') || 'SN';
  const cliente = note.clientName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
  return `${tipo}_${numero}_${cliente}.pdf`;
};

// Función para formatear el método de pago
const getPaymentMethodName = (paymentMethod?: string): string => {
  const methods: Record<string, string> = {
    'EFECTIVO': 'Efectivo',
    'TARJETA': 'Tarjeta',
    'TRANSFERENCIA': 'Transferencia',
    'CHEQUE': 'Cheque'
  };
  return methods[paymentMethod || ''] || 'Cuenta Corriente';
};

// Función para renderizar el contenido de la nota
const renderNotePageAsString = (
  note: Note,
  tipo: 'ORIGINAL' | 'DUPLICADO'
): string => {
  // Determinar el tipo de comprobante para el código
  const tipoLetra = note.cbteTipo === 2 || note.cbteTipo === 3 ? 'A' : 'B';
  const ptoVta = note.ptoVta || 1;
  const cbteNro = note.cbteDesde || 0;
  
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

      <!-- Columna derecha - Tipo y número de nota -->
      <div style="width: 48%; text-align: right;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
          ${getTipoNotaNombre(note.cbteTipo || 8)}
        </div>
        <div style="font-size: 12px; margin-bottom: 5px;">
          ${tipo}
        </div>
        <div style="font-size: 11px;">
          ${cbteNro ? `${tipoLetra}-${ptoVta.toString().padStart(5, '0')}-${cbteNro.toString().padStart(8, '0')}` : note.noteNumber || 'Sin número'}
        </div>
      </div>
    </div>

    <!-- Datos del receptor -->
    <div style="margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div style="width: 70%;">
          <div style="font-size: 14px; margin-bottom: 3px;">
            <strong>${note.clientName}</strong>
          </div>
          ${note.clientAddress ? `
            <div style="font-size: 11px; margin-bottom: 3px;">
              ${note.clientAddress}
            </div>
          ` : ''}
        </div>
        <div style="width: 28%; text-align: right; font-size: 11px;">
          Cod: ${note.cbteTipo === 2 || note.cbteTipo === 3 ? '12,308' : '12,309'}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px;">
        <div>
          ${note.clientCuit ? `CUIT: ${note.clientCuit}` : 'Sin CUIT'}
        </div>
        <div>
          ${formatearFecha(note.cbteFch || new Date().toISOString().split('T')[0])}
        </div>
      </div>
      <div style="font-size: 11px; margin-top: 3px;">
        ${note.cbteTipo === 2 || note.cbteTipo === 3 ? 'IVA Responsable Inscripto' : ''}
      </div>
    </div>

    <!-- Orden de Compra / Referencia -->
    <div style="margin-bottom: 15px; font-size: 11px;">
      <strong>Comprobante Asociado: ${note.originalInvoiceNumber}</strong>
    </div>

    <!-- Tabla de productos -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
      <thead>
        <tr style="border-bottom: 1px solid #000;">
          <th style="text-align: left; padding: 5px;">Cód.</th>
          <th style="text-align: left; padding: 5px;">Descripción</th>
          <th style="text-align: center; padding: 5px;">Cantidad</th>
          <th style="text-align: right; padding: 5px;">Precio Unit.</th>
          <th style="text-align: right; padding: 5px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${note.items.map((item, index) => {
          const precioUnitBase = item.unitPrice / 1.21;
          const totalBase = precioUnitBase * item.quantity;
          
          return `
          <tr>
            <td style="padding: 8px 5px;">${item.productCode || `PRE${index + 1}`}</td>
            <td style="padding: 8px 5px;">${item.productName}</td>
            <td style="text-align: center; padding: 8px 5px;">
              ${formatearCantidad(item.quantity)}
            </td>
            <td style="text-align: right; padding: 8px 5px;">
              ${precioUnitBase.toFixed(2)}
            </td>
            <td style="text-align: right; padding: 8px 5px;">
              ${totalBase.toFixed(2)}
            </td>
          </tr>
        `;
        }).join('')}
      </tbody>
    </table>

    <!-- Totales -->
    <div style="border-top: 1px solid #000; padding-top: 15px;">
      <div style="font-size: 11px; margin-bottom: 30px; text-align: center;">
        Son Pesos: <strong>${numeroALetras(note.totalAmount)}</strong>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
        <div>Forma de Pago: ${getPaymentMethodName(note.paymentMethod)}</div>
        <div style="text-align: right;">
          <div style="margin-bottom: 3px;">
            <span>SUBTOTAL</span>
            <span style="margin-left: 50px;">${note.subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
        <div>
          <div><strong>GRAVADO</strong></div>
          <div style="margin-top: 3px;">${note.subtotal.toFixed(2)}</div>
        </div>
        <div>
          <div><strong>EXENTO</strong></div>
        </div>
        <div>
          <div><strong>IVA 21%</strong></div>
          <div style="margin-top: 3px;">${note.ivaAmount.toFixed(2)}</div>
        </div>
        <div>
          <div><strong>I. BRUTOS</strong></div>
        </div>
        <div style="text-align: right;">
          <div><strong>TOTAL</strong></div>
          <div style="margin-top: 3px; font-size: 14px; font-weight: bold;">
            ${note.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>

    <!-- CAE Info -->
    ${note.cae ? `
      <div style="margin-top: 30px; font-size: 10px; border-top: 1px solid #000; padding-top: 10px;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <strong>CAE Nº:</strong> ${note.cae}
          </div>
          <div>
            <strong>Fecha Vto.:</strong> ${note.caeFchVto ? formatearFecha(note.caeFchVto) : ''}
          </div>
        </div>
      </div>
    ` : ''}
  `;
};

export const PrintNote = forwardRef<PrintNoteRef, PrintNoteProps>(
  ({ note, className = "" }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
      if (printRef.current) {
        const fileName = generarNombreArchivo(note);
        
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
                ${renderNotePageAsString(note, 'ORIGINAL')}
              </div>
              <div class="comprobante">
                ${renderNotePageAsString(note, 'DUPLICADO')}
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
        <div ref={printRef} />
      </div>
    );
  }
);

PrintNote.displayName = 'PrintNote';
