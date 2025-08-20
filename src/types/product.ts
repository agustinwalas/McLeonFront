export interface IProduct {
  _id: string;
  productCode: string;
  name: string;
  associatedSuppliers: string[];
  image: string;
  category: string; // Category ID as string
  wholesalePrice: number;
  retailPrice: number;
  currentStock: number;
  minimumStock: number;
  createdAt?: string;
  updatedAt?: string;
}

// For creating a new product (without _id)
export interface ProductCreateInput {
  productCode: string;
  name: string;
  associatedSuppliers?: string[];
  image?: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  currentStock?: number;
  minimumStock?: number;
}

// For updating a product
export interface ProductUpdateInput {
  productCode?: string;
  name?: string;
  associatedSuppliers?: string[];
  image?: string;
  category?: string;
  wholesalePrice?: number;
  retailPrice?: number;
  currentStock?: number;
  minimumStock?: number;
}

// Populated product with category details
export interface IProductPopulated extends Omit<IProduct, 'category' | 'associatedSuppliers'> {
  category: {
    _id: string;
    name: string;
    active: boolean;
  };
  associatedSuppliers: Array<{
    _id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    suppliedProducts: string[];
    createdAt: string;
    updatedAt: string;
  }>;
}
