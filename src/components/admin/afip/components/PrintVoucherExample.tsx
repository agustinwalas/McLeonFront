// Ejemplo de uso del componente PrintVoucher

import { PrintVoucher, PrintVoucherRef } from './PrintVoucher';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

export function EjemploUso() {
  const printRef = useRef<PrintVoucherRef>(null);

  // Datos de ejemplo - estos vendrían de tu respuesta de AFIP
  const datosComprobante = {
    // Datos del comprobante
    cbteTipo: 6, // Factura B
    ptoVta: 1,
    cbteDesde: 123,
    cbteHasta: 123,
    cbteFch: "20251003",
    cae: "74123456789012",
    vencimiento: "20251013",
    
    // Datos del receptor
    docTipo: 96, // DNI
    docNro: "14886003",
    nombreReceptor: "DIEGO AMUI",
    
    // Importes
    impNeto: 22111.22,
    impIVA: 4643.36,
    impTotal: 26754.58,
    
    // Detalle IVA
    iva: [
      {
        Id: 5,
        BaseImp: 18648.00,
        Importe: 3916.08,
        productName: "Torta de chocolate"
      },
      {
        Id: 5,
        BaseImp: 3463.22,
        Importe: 727.28,
        productName: "Cupcakes x12"
      }
    ],
    
    // Moneda
    monId: "PES",
    monCotiz: 1
  };

  // Función para imprimir programáticamente
  const handlePrintProgramatically = () => {
    if (printRef.current) {
      printRef.current.print();
    }
  };

  return (
    <div>
      {/* Opción 1: Usar el botón incluido en el componente */}
      <PrintVoucher data={datosComprobante} />
      
      {/* Opción 2: Controlar la impresión desde fuera */}
      <PrintVoucher 
        ref={printRef}
        data={datosComprobante} 
        className="hidden" // Ocultar el botón incluido
      />
      
      <Button onClick={handlePrintProgramatically}>
        🖨️ Imprimir desde otro botón
      </Button>
    </div>
  );
}

/*
FORMAS DE USO:

1. USO BÁSICO - Con botón incluido:
   <PrintVoucher data={datosComprobante} />

2. USO PROGRAMÁTICO - Llamar print() cuando quieras:
   const printRef = useRef<PrintVoucherRef>(null);
   
   <PrintVoucher ref={printRef} data={datosComprobante} className="hidden" />
   
   // Luego en cualquier función:
   printRef.current?.print();

3. DATOS DESDE RESPUESTA AFIP:
   const handleAfipSuccess = (respuestaAfip) => {
     const datosParaImprimir = {
       ...formData, // Datos del formulario
       cae: respuestaAfip.CAE,
       cbteDesde: respuestaAfip.CbteDesde,
       cbteHasta: respuestaAfip.CbteHasta,
       vencimiento: respuestaAfip.FchVto
     };
     
     // Imprimir automáticamente después de autorizar
     printRef.current?.print();
   };
*/