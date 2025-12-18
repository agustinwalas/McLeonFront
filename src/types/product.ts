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
  images?: string[];
  category: string;
  purchaseCost: number;
  wholesalePrice: number;
  retailPrice: number;
  currentStock: number;
  minimumStock: number;
  unitOfMeasure: UnitOfMeasure; 
  description?: string; 
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
  description?: string;
  category?: string;
  purchaseCost: number;
  wholesalePrice: number;
  retailPrice: number;
  currentStock: number;
  minimumStock: number;
  images: string[];
  associatedSuppliers: string[];
  unitOfMeasure: UnitOfMeasure; 
}

export interface ProductUpdateInput {
  productCode?: string;
  name?: string;
  description?: string;
  category?: string;
  purchaseCost?: number;
  wholesalePrice?: number;
  retailPrice?: number;
  currentStock?: number;
  minimumStock?: number;
  images?: string[];
  associatedSuppliers?: string[];
  unitOfMeasure?: UnitOfMeasure; // ✅ Agregado (opcional en updates)
}