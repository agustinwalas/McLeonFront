// src/types/shopifyCollection.ts

export interface IShopifyCollection {
  _id: string;
  categoryId?: {
    _id: string;
    name: string;
    fullName: string;
  };
  collectionName: string;
  shopifyCollectionId?: string;
  handle: string;
  description?: string;
  status: 'NOT_SYNCED' | 'SYNCING' | 'SYNCED' | 'ERROR' | 'NEEDS_UPDATE';
  collectionType: 'category-based' | 'manual' | 'featured' | 'seasonal';
  lastSync?: Date;
  syncErrors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopifyCollectionCreateInput {
  name: string;
  description?: string;
  type?: 'manual' | 'featured' | 'seasonal';
  imageUrl?: string;
}

export interface ShopifyCollectionFromCategoryInput {
  categoryId: string;
}

export interface ShopifyCollectionUpdateInput {
  name?: string;
  description?: string;
  type?: 'manual' | 'featured' | 'seasonal';
}

export interface ShopifyCollectionSyncResponse {
  success: number;
  errors: Array<{
    categoryId: string;
    error: string;
  }>;
}

export type ShopifyCollectionType = 'category-based' | 'manual' | 'featured' | 'seasonal';
export type ShopifyCollectionStatus = 'NOT_SYNCED' | 'SYNCING' | 'SYNCED' | 'ERROR' | 'NEEDS_UPDATE';