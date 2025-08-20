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
