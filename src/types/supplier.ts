export interface ISupplier {
  _id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  suppliedProducts: string[]; // Product IDs as strings
  createdAt?: string;
  updatedAt?: string;
}

// For creating a new supplier (without _id)
export interface SupplierCreateInput {
  name: string;
  phone: string;
  email: string;
  location: string;
  suppliedProducts?: string[];
}

// For updating a supplier
export interface SupplierUpdateInput {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  suppliedProducts?: string[];
}

// Populated supplier with product details
export interface ISupplierPopulated extends Omit<ISupplier, 'suppliedProducts'> {
  suppliedProducts: {
    _id: string;
    name: string;
    productCode: string;
  }[];
}

// Response for price update
export interface UpdatePricesResponse {
  message: string;
  supplier: string;
  productsUpdated: number;
  priceChange: string;
  percentage: number;
  updatedProducts: {
    id: string;
    name: string;
    productCode: string;
    newPrices: {
      purchaseCost: number;
      wholesalePrice: number;
      retailPrice: number;
    };
  }[];
}
