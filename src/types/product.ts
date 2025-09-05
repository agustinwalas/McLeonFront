export enum UnitOfMeasure {
  UNIDAD = "UNIDAD",
  GRAMO = "GRAMO",
  KILOGRAMO = "KILOGRAMO"
}

// ...existing interfaces...
export interface IProduct {
  _id: string;
  productCode: string;
  name: string;
  associatedSuppliers: string[];
  image?: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  currentStock: number;
  minimumStock: number;
  unitOfMeasure: UnitOfMeasure; 
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductPopulated extends Omit<IProduct, 'category' | 'associatedSuppliers'> {
  category?: {
    _id: string;
    name: string;
    active: boolean;
  } | string | null;
  associatedSuppliers: Array<{
    _id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
  }>;
}

export interface ProductCreateInput {
  productCode: string;
  name: string;
  category?: string;
  wholesalePrice: number;
  retailPrice: number;
  currentStock: number;
  minimumStock: number;
  image?: string;
  associatedSuppliers: string[];
  unitOfMeasure: UnitOfMeasure; 
}

export interface ProductUpdateInput {
  productCode?: string;
  name?: string;
  category?: string;
  wholesalePrice?: number;
  retailPrice?: number;
  currentStock?: number;
  minimumStock?: number;
  image?: string;
  associatedSuppliers?: string[];
  unitOfMeasure?: UnitOfMeasure; // ✅ Agregado (opcional en updates)
}