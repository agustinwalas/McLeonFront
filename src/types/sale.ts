// src/types/sale.ts

export enum PaymentMethod {
  CASH = "EFECTIVO",
  CREDIT_CARD = "TARJETA_CREDITO",
  DEBIT_CARD = "TARJETA_DEBITO",
  BANK_TRANSFER = "TRANSFERENCIA",
  CHECK = "CHEQUE",
  MERCADO_PAGO = "MERCADO_PAGO",
  MULTIPLE = "MULTIPLE"
}

export enum PriceType {
  WHOLESALE = "MAYORISTA",
  RETAIL = "MINORISTA"
}

export enum DeliveryType {
  PICKUP = "RETIRO_LOCAL",
  DELIVERY = "ENVIO"
}

export interface ISaleProduct {
  product: string; // ObjectId ref to Product
  quantity: number;
  priceType: PriceType;
  unitPrice: number; // Precio al momento de la venta
  discountPercentage: number; // Default 100%, si es 90% = 10% descuento
  subtotal: number;
}

export interface IDeliveryAddress {
  street: string;
  number: string;
  city: string;
  province: string;
  postalCode: string;
  additionalInfo?: string;
}

export interface IAfipInvoice {
  invoiceType?: string; // Tipo de comprobante (Factura A, B, C, etc.)
  invoiceNumber?: string;
  cae?: string; // Código de Autorización Electrónico
  caeExpirationDate?: Date;
  invoiceDate?: Date;
  isElectronic: boolean;
}

// ✅ Nueva interface para datos AFIP (compatible con backend)
export interface IAfipData {
  cuit: string;
  puntoVenta: number;
  tipoComprobante: number;
  numeroComprobante?: number;
  cae?: string;
  vencimientoCae?: string;
  fechaEmision?: string;
  concepto: number;
  documentoTipo: number;
  documentoNumero: string;
  importeTotal: number;
  importeNeto: number;
  importeIva: number;
  estado?: 'PENDIENTE' | 'AUTORIZADA' | 'RECHAZADA';
  observaciones?: string;
}

export interface ISale {
  _id?: string;
  saleNumber: string; // Número interno de venta
  user: string; // ObjectId ref to User (quien realizó la venta)
  client: string; // ObjectId ref to Client
  products: ISaleProduct[];
  subtotal: number; // Suma de todos los subtotales
  totalDiscount: number; // Descuento total aplicado
  totalAmount: number; // Precio final
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  deliveryAddress?: IDeliveryAddress;
  deliveryFee?: number;
  afipInvoice?: IAfipInvoice;
  afipData?: IAfipData; // ✅ Solo agregué este campo
  notes?: string;
  saleDate: Date;
  deliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Para crear venta
export interface ICreateSale extends Omit<ISale, '_id' | 'createdAt' | 'updatedAt' | 'saleNumber' | 'saleDate'> {
  saleDate?: Date;
}

// Para crear venta desde el frontend (sin user, se obtiene del token)
export type ICreateSaleRequest = Omit<ICreateSale, 'user'>;

// Para actualizar venta
export type IUpdateSale = Partial<Omit<ISale, '_id' | 'createdAt' | 'updatedAt' | 'saleNumber'>>;

// Para respuesta con datos populados
export interface ISalePopulated extends Omit<ISale, 'user' | 'client' | 'products'> {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  client: {
    _id: string;
    name: string;
    cuit: string;
    taxCondition: string;
    address: string;
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      productCode: string;
      image?: string;
      currentStock: number;
    };
    quantity: number;
    priceType: PriceType;
    unitPrice: number;
    discountPercentage: number;
    subtotal: number;
  }>;
}
