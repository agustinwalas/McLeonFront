import { ISalePopulated } from "@/types/sale";
import { VoucherFormData, IvaData } from "../schemas/voucherSchema";
import { yyyymmdd, onlyDigits, EMISOR_CONFIG } from "../constants/afipConstants";

// ✅ Función para mapear condición IVA del cliente a tipo de comprobante
export const getComprobanteType = (afipCondicionIva: number): number => {
  switch (afipCondicionIva) {
    case 1: // Responsable Inscripto
      return 1; // Factura A
    case 4: // Exento
    case 5: // Consumidor Final
    case 6: // Responsable Monotributo
      return 6; // Factura B
    default:
      return 11; // Factura C
  }
};

// ✅ Función para mapear tipo de documento del cliente
export const getDocTipo = (documentType: string): number => {
  switch (documentType?.toUpperCase()) {
    case 'CUIT':
      return 80;
    case 'CUIL':
      return 86;
    case 'DNI':
      return 96;
    default:
      return 99; // Consumidor Final
  }
};

// ✅ Función para calcular IVA por cada producto individual
export const calculateIvaFromSale = (sale: ISalePopulated): IvaData[] => {
 

  const ivaItems: IvaData[] = sale.products.map((productSale, index) => {
    // Subtotal del producto (quantity * unitPrice con descuentos aplicados)
    const subtotalProducto = productSale.subtotal;
    
    // Calcular base imponible (sin IVA 21%)
    const baseImponible = subtotalProducto / 1.21;
    const ivaImporte = subtotalProducto - baseImponible;

    console.log(`📦 Producto ${index + 1}: ${productSale.product.name}`, {
      cantidad: productSale.quantity,
      precioUnitario: productSale.unitPrice,
      subtotal: subtotalProducto,
      baseImponible: Number(baseImponible.toFixed(2)),
      ivaImporte: Number(ivaImporte.toFixed(2))
    });

    return {
      Id: 5, // 21% para repostería
      BaseImp: Number(baseImponible.toFixed(2)),
      Importe: Number(ivaImporte.toFixed(2)),
      // ✅ Agregar información del producto para referencia
      productName: productSale.product.name,
      quantity: productSale.quantity,
      unitPrice: productSale.unitPrice,
    };
  });

  // ✅ Agregar el costo de envío como un item adicional si existe
  if (sale.deliveryFee && sale.deliveryFee > 0) {
    const deliveryFeeWithIva = sale.deliveryFee;
    const deliveryBaseImponible = deliveryFeeWithIva / 1.21;
    const deliveryIvaImporte = deliveryFeeWithIva - deliveryBaseImponible;

    console.log(`🚚 Envío:`, {
      costoEnvio: deliveryFeeWithIva,
      baseImponible: Number(deliveryBaseImponible.toFixed(2)),
      ivaImporte: Number(deliveryIvaImporte.toFixed(2))
    });

    ivaItems.push({
      Id: 5, // 21% para envío también
      BaseImp: Number(deliveryBaseImponible.toFixed(2)),
      Importe: Number(deliveryIvaImporte.toFixed(2)),
      // ✅ Información del envío
      productName: 'ENVÍO A DOMICILIO',
      quantity: 1,
      unitPrice: deliveryFeeWithIva,
    });
  }

 
  return ivaItems;
};

// ✅ Función para mapear taxCondition a código AFIP
const mapTaxConditionToAfipCode = (taxCondition: string): number => {
  switch (taxCondition?.toLowerCase()) {
    case 'responsable inscripto':
      return 1;
    case 'exento':
      return 4;
    case 'consumidor final':
      return 5;
    case 'responsable monotributo':
      return 6;
    default:
      return 5; // Consumidor Final por defecto
  }
};

// ✅ Función para popular datos desde la venta
export const populateFromSale = (sale: ISalePopulated): Partial<VoucherFormData> => {
 

  const client = sale.client;
  const cbteTipo = getComprobanteType(mapTaxConditionToAfipCode(client.taxCondition));
  const docTipo = getDocTipo(client.documentType || 'DNI');
  const ivaData = calculateIvaFromSale(sale);

  // Calcular totales
  const impNeto = ivaData.reduce((sum, item) => sum + item.BaseImp, 0);
  const impIVA = ivaData.reduce((sum, item) => sum + item.Importe, 0);

  const populated = {
    // Emisor desde configuración
    emisorCuit: EMISOR_CONFIG.CUIT,
    ptoVta: EMISOR_CONFIG.PUNTO_VENTA,
    cbteTipo: cbteTipo,

    // Receptor desde el cliente
    docTipo: docTipo,
    docNro: client.documentNumber || "0",
    nombreReceptor: client.name,

    // Fecha actual
    cbteFch: yyyymmdd(new Date()),

    // Importes desde la venta
    impNeto: Number(impNeto.toFixed(2)),
    impIVA: Number(impIVA.toFixed(2)),
    impTotal: sale.totalAmount,

    // IVA calculado por productos
    iva: ivaData,

    // Moneda
    monId: "PES" as const,
    monCotiz: 1 as const,
  };

 
  return populated;
};

// ✅ Función para crear payload AFIP
export const createAfipPayload = (values: VoucherFormData, sale?: ISalePopulated | null) => {
  const payload = {
    CbteTipo: values.cbteTipo,
    PtoVta: values.ptoVta,
    Concepto: 1, // Productos fijo
    DocTipo: values.docTipo,
    DocNro: Number(onlyDigits(values.docNro) || "0"),
    CbteFch: values.cbteFch,

    // ✅ Importes (campos no usados siempre en 0)
    ImpTotal: Number(values.impTotal.toFixed(2)),
    ImpTotConc: 0, // ✅ Siempre 0 para repostería
    ImpNeto: Number(values.impNeto.toFixed(2)),
    ImpOpEx: 0,    // ✅ Siempre 0 para repostería  
    ImpIVA: Number(values.impIVA.toFixed(2)),
    ImpTrib: 0,    // ✅ Siempre 0 para repostería

    MonId: "PES",
    MonCotiz: 1,

    // ✅ IVA con importes redondeados
    Iva: values.iva.map((r) => ({
      Id: r.Id,
      BaseImp: Number(r.BaseImp.toFixed(2)),
      Importe: Number(r.Importe.toFixed(2)),
    })),

    // ✅ CUIT emisor desde configuración
    EmisorCUIT: Number(onlyDigits(EMISOR_CONFIG.CUIT)),
    NombreReceptor: values.nombreReceptor,

    // ✅ Datos adicionales de la venta
    VentaId: sale?._id,
    VentaNumero: sale?.saleNumber,

    // ✅ Campos adicionales para completar el comprobante
    FchVtoPago: values.cbteFch, // Mismo día como vencimiento por defecto
  };

  return payload;
};