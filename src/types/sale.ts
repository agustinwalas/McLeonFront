// src/types/sale.ts
import { IAfipInvoice, IAfipData } from './afip';

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
  DELIVERY = "DELIVERY"
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

export interface ISale {
  _id?: string;
  saleNumber: string; // Número interno de venta
  user: string; // ObjectId ref to User (quien realizó la venta)
  client: string; // ObjectId ref to Client
  products: ISaleProduct[];
  subtotal: number; // Suma de todos los subtotales
  totalDiscount: number; // Descuento total aplicado
  totalAmount: number; // Precio final
  amountPaid: number; // Monto pagado
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  deliveryAddress?: IDeliveryAddress;
  deliveryFee?: number;
  afipInvoice?: IAfipInvoice;
  afipData?: IAfipData;
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
    documentType: string;
    documentNumber: string;
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
