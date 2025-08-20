export enum TaxCondition {
  RESPONSABLE_INSCRIPTO = "Responsable Inscripto",
  MONOTRIBUTO = "Monotributo",
  CONSUMIDOR_FINAL = "Consumidor Final"
}

export enum DocumentType {
  DNI = "DNI",
  CUIT = "CUIT",
  CUIL = "CUIL",
  PASSPORT = "Passport"
}

export interface IClient {
  _id: string;
  name: string;
  cuit: string;
  taxCondition: TaxCondition;
  documentType: DocumentType;
  address: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// For creating a new client (without _id)
export interface ClientCreateInput {
  name: string;
  cuit: string;
  taxCondition: TaxCondition;
  documentType: DocumentType;
  address: string;
  phone?: string;
}

// For updating a client
export interface ClientUpdateInput {
  name?: string;
  cuit?: string;
  taxCondition?: TaxCondition;
  documentType?: DocumentType;
  address?: string;
  phone?: string;
}
