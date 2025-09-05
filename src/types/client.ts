// ===============================
// AFIP: Enums y catálogos
// ===============================

export enum TaxCondition {
  RESPONSABLE_INSCRIPTO = "Responsable Inscripto",
  MONOTRIBUTO = "Monotributo",
  CONSUMIDOR_FINAL = "Consumidor Final",
  EXENTO = "Exento",
  NO_RESPONSABLE = "No Responsable",
  MONOTRIBUTO_SOCIAL = "Monotributo Social",
  PEQUENO_CONTRIBUYENTE_EVENTUAL = "Pequeño Contribuyente Eventual",
  PEQUENO_CONTRIBUYENTE_EVENTUAL_SOCIAL = "Pequeño Contribuyente Eventual Social",
  NO_CATEGORIZADO = "No Categorizado",
}

export enum DocumentType {
  CUIT = "CUIT",
  CUIL = "CUIL",
  CDI = "CDI",        // Cédula de Identidad
  LE = "LE",          // Libreta de Enrolamiento
  LC = "LC",          // Libreta Cívica
  DNI = "DNI",
  PASSPORT = "PASSPORT",
  CONSUMIDOR_FINAL = "CONSUMIDOR_FINAL", // DocTipo 99 (sin identificación)
}

export enum AfipCondicionIva {
  RESPONSABLE_INSCRIPTO = 1,
  EXENTO = 2,
  // (3 y 4 existen en AFIP pero se usan poco en práctica moderna)
  CONSUMIDOR_FINAL = 5,
  RESPONSABLE_NO_INSCRIPTO = 6, // histórico/poco usado; incluído por compatibilidad
  MONOTRIBUTO = 11,
  PEQUENO_CONTRIBUYENTE_EVENTUAL = 13,
  MONOTRIBUTO_SOCIAL = 14,
  PEQUENO_CONTRIBUYENTE_EVENTUAL_SOCIAL = 15,
  NO_CATEGORIZADO = 99,
}

export const taxConditionToAfipMap: Record<string, number> = {
  "Responsable Inscripto": 1, // AfipCondicionIva.RESPONSABLE_INSCRIPTO
  "Exento": 2, // AfipCondicionIva.EXENTO
  "Consumidor Final": 5, // AfipCondicionIva.CONSUMIDOR_FINAL
  "No Responsable": 6, // AfipCondicionIva.RESPONSABLE_NO_INSCRIPTO
  "Monotributo": 11, // AfipCondicionIva.MONOTRIBUTO
  "Pequeño Contribuyente Eventual": 13, // AfipCondicionIva.PEQUENO_CONTRIBUYENTE_EVENTUAL
  "Monotributo Social": 14, // AfipCondicionIva.MONOTRIBUTO_SOCIAL
  "Pequeño Contribuyente Eventual Social": 15, // AfipCondicionIva.PEQUENO_CONTRIBUYENTE_EVENTUAL_SOCIAL
  "No Categorizado": 99, // AfipCondicionIva.NO_CATEGORIZADO
};

export enum ClientType {
  PERSONA_FISICA = "PERSONA_FISICA",
  PERSONA_JURIDICA = "PERSONA_JURIDICA",
}

// Códigos AFIP DocTipo oficiales para WSFE
export const DOCUMENT_TYPE_TO_AFIP: Record<DocumentType, number> = {
  [DocumentType.CUIT]: 80,
  [DocumentType.CUIL]: 86,
  [DocumentType.CDI]: 87,
  [DocumentType.LE]: 89,
  [DocumentType.LC]: 90,
  [DocumentType.DNI]: 96,          // <— corregido (no 91)
  [DocumentType.PASSPORT]: 94,
  [DocumentType.CONSUMIDOR_FINAL]: 99,
};

// Mapeo "humano" → AFIP (útil para UI/normalización)
export const TAX_CONDITION_TO_AFIP: Record<TaxCondition, AfipCondicionIva> = {
  [TaxCondition.RESPONSABLE_INSCRIPTO]: AfipCondicionIva.RESPONSABLE_INSCRIPTO,
  [TaxCondition.MONOTRIBUTO]: AfipCondicionIva.MONOTRIBUTO,
  [TaxCondition.CONSUMIDOR_FINAL]: AfipCondicionIva.CONSUMIDOR_FINAL,
  [TaxCondition.EXENTO]: AfipCondicionIva.EXENTO,
  [TaxCondition.NO_RESPONSABLE]: AfipCondicionIva.RESPONSABLE_NO_INSCRIPTO,
  [TaxCondition.MONOTRIBUTO_SOCIAL]: AfipCondicionIva.MONOTRIBUTO_SOCIAL,
  [TaxCondition.PEQUENO_CONTRIBUYENTE_EVENTUAL]: AfipCondicionIva.PEQUENO_CONTRIBUYENTE_EVENTUAL,
  [TaxCondition.PEQUENO_CONTRIBUYENTE_EVENTUAL_SOCIAL]: AfipCondicionIva.PEQUENO_CONTRIBUYENTE_EVENTUAL_SOCIAL,
  [TaxCondition.NO_CATEGORIZADO]: AfipCondicionIva.NO_CATEGORIZADO,
};

export interface ClientCreateInput {
  name: string;
  clientType: ClientType;
  documentType: DocumentType;
  documentNumber: string;
  taxCondition: TaxCondition;
  afipCondicionIva: AfipCondicionIva;
  fiscalAddress?: Address;
  shippingAddress?: Address;
  email?: string;
  phone?: string;
  cuit?: string;
}


// ===============================
// Direcciones
// ===============================

export interface Address {
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;   // recomendable catalogar (AFIP/ISO)
  postalCode: string;
  country: string;    // "Argentina" por defecto
}

// ===============================
// Cliente: modelo principal
// ===============================

export interface IClient {
  _id: string;

  // Identidad
  name: string;                       // Razón social o nombre y apellido
  clientType: ClientType;             // Persona física / jurídica

  // Documento AFIP
  documentType: DocumentType;         // DocTipo
  documentNumber: string;             // DocNro (solo dígitos) — si CUIT/CUIL/CDI → 11 dígitos

  // Condición fiscal
  taxCondition: TaxCondition;         // Para UI/negocio
  afipCondicionIva: AfipCondicionIva; // Valor AFIP (para WSFE)

  // CUIT como campo explícito (útil si documentType = CUIT)
  cuit?: string;                      // duplicado de documentNumber cuando DocType=CUIT (opcional)

  // Contacto
  email?: string;                     // envío de PDF
  phone?: string;

  // Domicilios
  fiscalAddress: Address;             // Domicilio fiscal (para PDF; WSFE no lo valida)
  shippingAddress?: Address;          // Domicilio de entrega (logística, no AFIP)

  // Preferencias/negocio (no AFIP)
  acceptsElectronicInvoice?: boolean; // default true
  defaultPaymentMethod?: string;
  creditLimit?: number;
  priceList?: "MAYORISTA" | "MINORISTA";
  contactPerson?: string;
  contactPhone?: string;
  fantasyName?: string;
  businessActivity?: string;

  // Estado & metadatos
  isActive: boolean;                  // default true
  createdAt?: string;
  updatedAt?: string;

  // Exterior (opcional)
  foreignTaxId?: string;              // id fiscal extranjero si aplica
}

// ===============================
// DTOs
// ===============================

export interface ICreateClientRequest {
  name: string;
  clientType: ClientType;

  documentType: DocumentType;
  documentNumber: string;

  taxCondition: TaxCondition;
  afipCondicionIva: AfipCondicionIva;

  fiscalAddress: Address;
  shippingAddress?: Address;

  email?: string;
  phone?: string;
  cuit?: string;

  acceptsElectronicInvoice?: boolean; // default true
  defaultPaymentMethod?: string;
  creditLimit?: number;
  priceList?: "MAYORISTA" | "MINORISTA";
  contactPerson?: string;
  contactPhone?: string;
  fantasyName?: string;
  businessActivity?: string;
  isActive?: boolean;                 // default true

  foreignTaxId?: string;
}

export interface IUpdateClientRequest {
  name?: string;
  clientType?: ClientType;

  documentType?: DocumentType;
  documentNumber?: string;

  taxCondition?: TaxCondition;
  afipCondicionIva?: AfipCondicionIva;

  fiscalAddress?: Partial<Address>;
  shippingAddress?: Partial<Address>;

  email?: string;
  phone?: string;
  cuit?: string;

  acceptsElectronicInvoice?: boolean;
  defaultPaymentMethod?: string;
  creditLimit?: number;
  priceList?: "MAYORISTA" | "MINORISTA";
  contactPerson?: string;
  contactPhone?: string;
  fantasyName?: string;
  businessActivity?: string;
  isActive?: boolean;

  foreignTaxId?: string;
}

// ===============================
// Helpers de validación
// ===============================

export const onlyDigits = (v: string) => (v || "").replace(/\D+/g, "");

export function isValidCuit(cuit: string): boolean {
  const v = onlyDigits(cuit);
  if (!/^\d{11}$/.test(v)) return false;
  const dig = v.split("").map(Number);
  const mul = [5,4,3,2,7,6,5,4,3,2];
  const sum = mul.reduce((acc, m, i) => acc + m * dig[i], 0);
  const mod = 11 - (sum % 11);
  const check = mod === 11 ? 0 : mod === 10 ? 9 : mod;
  return check === dig[10];
}

export function isValidDocNumber(docType: DocumentType, docNumber: string): boolean {
  const n = onlyDigits(docNumber);
  switch (docType) {
    case DocumentType.CUIT:
    case DocumentType.CUIL:
    case DocumentType.CDI:
      return /^\d{11}$/.test(n) && (docType === DocumentType.CUIT ? isValidCuit(n) : true);
    case DocumentType.DNI:
      return /^\d{7,9}$/.test(n); // DNI moderno 7–9 dígitos
    case DocumentType.LE:
    case DocumentType.LC:
      return /^\d{6,8}$/.test(n);
    case DocumentType.PASSPORT:
      return n.length >= 6; // flexible (puede incluir letras en origen)
    case DocumentType.CONSUMIDOR_FINAL:
      return n === "0" || n === ""; // AFIP suele usar 0
    default:
      return n.length > 0;
  }
}

// ===============================
// Normalización y derivación
// ===============================

/**
 * Devuelve un par {DocTipo, DocNro} para WSFE,
 * normalizando según documentType/documentNumber.
 */
export function toAfipReceptorDoc(client: Pick<IClient, "documentType"|"documentNumber"|"cuit">) {
  const docType = client.documentType;
  let docNumber = onlyDigits(client.documentNumber || "");

  // Si es CUIT y viene vacío, intentar usar client.cuit
  if (docType === DocumentType.CUIT && (!docNumber || docNumber.length === 0) && client.cuit) {
    docNumber = onlyDigits(client.cuit);
  }

  // Consumidor final sin identificación
  if (docType === DocumentType.CONSUMIDOR_FINAL && !docNumber) {
    docNumber = "0";
  }

  const DocTipo = DOCUMENT_TYPE_TO_AFIP[docType];
  const DocNro = docNumber;

  return { DocTipo, DocNro };
}

/**
 * Sugerencia de tipo de comprobante según condición IVA del receptor.
 * (Solo referencia; la decisión final depende también de la condición del emisor y normativa vigente)
 */
export type TipoComprobanteSugerido = "A" | "B" | "C" | "M";
export function sugerirTipoComprobanteReceptor(condIvaReceptor: AfipCondicionIva): TipoComprobanteSugerido {
  switch (condIvaReceptor) {
    case AfipCondicionIva.RESPONSABLE_INSCRIPTO:
      return "A"; // o "M" en casos puntuales del emisor
    case AfipCondicionIva.MONOTRIBUTO:
    case AfipCondicionIva.EXENTO:
    case AfipCondicionIva.CONSUMIDOR_FINAL:
    case AfipCondicionIva.RESPONSABLE_NO_INSCRIPTO:
    case AfipCondicionIva.NO_CATEGORIZADO:
    case AfipCondicionIva.MONOTRIBUTO_SOCIAL:
    case AfipCondicionIva.PEQUENO_CONTRIBUYENTE_EVENTUAL:
    case AfipCondicionIva.PEQUENO_CONTRIBUYENTE_EVENTUAL_SOCIAL:
    default:
      return "B"; // o "C" según condición del emisor
  }
}

// ===============================
// Reglas útiles para CF (opcional)
// ===============================

/**
 * Si el receptor es Consumidor Final, AFIP exige identificarlo
 * (DNI + domicilio) por encima de cierto umbral.
 * Esta utilidad te permite decidir si debés exigir DNI.
 */
export function cfRequiereIdentificacion(totalFactura: number, umbral: number): boolean {
  return totalFactura >= umbral;
}

// ===============================
// Ejemplo de guardado/validación mínima
// ===============================

export function validarClienteMinimoAFIP(c: Pick<IClient,
  "name"|"documentType"|"documentNumber"|"afipCondicionIva">): { ok: true } | { ok: false; error: string } {

  if (!c.name?.trim()) return { ok: false, error: "Falta nombre/razón social" };

  if (!(c.documentType in DocumentType)) return { ok: false, error: "Tipo de documento inválido" };

  if (!isValidDocNumber(c.documentType, c.documentNumber)) {
    return { ok: false, error: "Número de documento inválido para el tipo seleccionado" };
  }

  if (!Object.values(AfipCondicionIva).includes(c.afipCondicionIva)) {
    return { ok: false, error: "Condición IVA AFIP inválida" };
  }

  return { ok: true };
}
