export interface ICategory {
  _id: string;
  name: string;
  fullName: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// For creating a new category (without _id)
export interface CategoryCreateInput {
  name: string;
  fullName: string;
  active?: boolean;
}

// For updating a category
export interface CategoryUpdateInput {
  name?: string;
  fullName?: string;
  active?: boolean;
}
