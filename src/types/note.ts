// Tipos para Notas de Débito y Crédito en el frontend

export enum NoteType {
  DEBITO = "DEBITO",
  CREDITO = "CREDITO"
}

export enum DebitReason {
  INTERESES_MORA = "INTERESES_MORA",
  GASTOS_ADICIONALES = "GASTOS_ADICIONALES", 
  CORRECCION_MENOS = "CORRECCION_MENOS",
  SERVICIOS_EXTRA = "SERVICIOS_EXTRA",
  RECARGOS = "RECARGOS",
  OTROS = "OTROS"
}

export enum CreditReason {
  DEVOLUCION = "DEVOLUCION",
  DESCUENTO = "DESCUENTO",
  CORRECCION_MAS = "CORRECCION_MAS", 
  ANULACION_PARCIAL = "ANULACION_PARCIAL",
  BONIFICACION = "BONIFICACION",
  OTROS = "OTROS"
}

export interface NoteItem {
  productId?: string;
  productName: string;
  productCode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface Note {
  id: string;
  noteType: NoteType;
  noteNumber?: string;
  
  // Relación con factura original
  originalSaleId: string;
  originalInvoiceNumber: string;
  originalAfipData: {
    cbteTipo: number;
    ptoVta: number;
    cbteNro: number;
    cbteFch: string;
    cae?: string;
  };
  
  // Cliente
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientCuit?: string;
  clientAddress?: string;
  
  // Motivo
  reason: DebitReason | CreditReason;
  customReason?: string;
  description: string;
  
  // Items
  items: NoteItem[];
  
  // Montos
  subtotal: number;
  ivaAmount: number;
  totalAmount: number;
  
  // Forma de pago
  paymentMethod?: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CHEQUE';
  
  // AFIP
  cbteTipo?: number;
  ptoVta?: number;
  cbteDesde?: number;
  cbteHasta?: number;
  cbteFch?: string;
  cae?: string;
  caeFchVto?: string;
  resultado?: string;
  observaciones?: string;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT_TO_AFIP' | 'COMPLETED' | 'ERROR';
}

export interface CreateNoteData {
  noteType: NoteType;
  originalSaleId: string;
  reason: DebitReason | CreditReason;
  customReason?: string;
  description: string;
  items: CreateNoteItem[];
}

export interface CreateNoteItem {
  productId?: string;
  productName: string;
  productCode?: string;
  quantity: number;
  unitPrice: number;
  description?: string;
}

export interface UpdateNoteData {
  reason?: DebitReason | CreditReason;
  customReason?: string;
  description?: string;
  items?: CreateNoteItem[];
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT_TO_AFIP' | 'COMPLETED' | 'ERROR';
}

export interface NoteFilters {
  noteType?: NoteType;
  clientId?: string;
  originalSaleId?: string;
  status?: string;
  reason?: DebitReason | CreditReason;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface NoteStats {
  totalNotes: number;
  totalDebits: number;
  totalCredits: number;
  totalDebitAmount: number;
  totalCreditAmount: number;
  notesByStatus: {
    status: string;
    count: number;
    totalAmount: number;
  }[];
  notesByReason: {
    reason: string;
    count: number;
    totalAmount: number;
  }[];
}

// Labels para mostrar en la UI
export const DEBIT_REASON_LABELS: Record<DebitReason, string> = {
  [DebitReason.INTERESES_MORA]: "Intereses por mora",
  [DebitReason.GASTOS_ADICIONALES]: "Gastos adicionales",
  [DebitReason.CORRECCION_MENOS]: "Corrección - se facturó de menos",
  [DebitReason.SERVICIOS_EXTRA]: "Servicios adicionales",
  [DebitReason.RECARGOS]: "Recargos aplicados",
  [DebitReason.OTROS]: "Otros motivos"
};

export const CREDIT_REASON_LABELS: Record<CreditReason, string> = {
  [CreditReason.DEVOLUCION]: "Devolución de mercadería",
  [CreditReason.DESCUENTO]: "Descuento aplicado",
  [CreditReason.CORRECCION_MAS]: "Corrección - se facturó de más",
  [CreditReason.ANULACION_PARCIAL]: "Anulación parcial",
  [CreditReason.BONIFICACION]: "Bonificación",
  [CreditReason.OTROS]: "Otros motivos"
};

export const NOTE_STATUS_LABELS = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  SENT_TO_AFIP: "Enviada a AFIP",
  COMPLETED: "Completada",
  ERROR: "Error"
} as const;