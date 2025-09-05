// src/types/afip.ts

export interface AfipIvaItem {
  Id: number;         // 5=21, 4=10.5, etc.
  BaseImp: number;
  Importe: number;
}

export interface AfipCbteAsoc {
  Tipo: number;       // tipo del comprobante asociado
  PtoVta: number;
  Nro: number;
  CbteFch?: string;   // AAAAMMDD
}

export interface AfipVoucherCreateInput {
  // Emisor
  EmisorCUIT: number;           // opcional si tu backend lo toma de las credenciales
  PtoVta: number;
  CbteTipo: number;             // 1=A, 6=B, 11=C, etc.
  Concepto: number;             // 1=Prod, 2=Serv, 3=Ambos

  // Receptor
  DocTipo: number;              // 80=CUIT, 86=CUIL, 96=DNI, 99=CF
  DocNro: number;               // "0" si CF sin identificación
  NombreReceptor?: string;

  // Fechas
  CbteFch: string;              // AAAAMMDD
  ServicioDesde?: string;       // AAAAMMDD (si Concepto 2/3)
  ServicioHasta?: string;       // AAAAMMDD (si Concepto 2/3)
  FchVtoPago?: string;          // AAAAMMDD (si Concepto 2/3)

  // Importes
  ImpTotal: number;
  ImpTotConc: number;           // no gravado
  ImpNeto: number;
  ImpOpEx: number;              // exento
  ImpIVA: number;
  ImpTrib: number;              // tributos

  // IVA detalle
  Iva: AfipIvaItem[];

  // Moneda
  MonId: string;                // PES, USD, EUR...
  MonCotiz: number;

  // Comprobantes asociados (p/ NC/ND)
  CbtesAsoc?: AfipCbteAsoc[];
}

export interface AfipVoucherResponse {
  CAE: string;
  CAEFchVto: string;     // AAAAMMDD
  CbteDesde: number;
  CbteHasta: number;
  Observaciones?: Array<{ Code: number; Msg: string }>;
  Resultado?: "A" | "R"; // Aprobado / Rechazado
}

export interface AfipUltimoAutorizado {
  cbteTipo: number;
  ptoVta: number;
  nro: number;  // último autorizado
}

export interface AfipCatalogItem {
  Id: number | string;
  Desc: string;
}

export interface IAfipInvoice {
  invoiceType?: string; // Tipo de comprobante (Factura A, B, C, etc.)
  invoiceNumber?: string;
  cae?: string; // Código de Autorización Electrónico
  caeExpirationDate?: Date;
  invoiceDate?: Date;
  isElectronic: boolean;
}

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

// Enums relacionados con AFIP
export enum AfipTipoComprobante {
  FACTURA_A = 1,
  NOTA_DEBITO_A = 2,
  NOTA_CREDITO_A = 3,
  FACTURA_B = 6,
  NOTA_DEBITO_B = 7,
  NOTA_CREDITO_B = 8,
  FACTURA_C = 11,
  NOTA_DEBITO_C = 12,
  NOTA_CREDITO_C = 13
}

export enum AfipDocumentoTipo {
  CUIT = 80,
  CUIL = 86,
  CDI = 87,
  LE = 89,
  LC = 90,
  CI = 91,
  PASAPORTE = 94
}

export enum AfipConcepto {
  PRODUCTOS = 1,
  SERVICIOS = 2,
  PRODUCTOS_Y_SERVICIOS = 3
}

export enum AfipEstado {
  PENDIENTE = 'PENDIENTE',
  AUTORIZADA = 'AUTORIZADA', 
  RECHAZADA = 'RECHAZADA'
}

