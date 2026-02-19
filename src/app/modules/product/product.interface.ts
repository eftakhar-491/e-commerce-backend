export interface IVariantOptionInput {
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock?: number;
  isActive?: boolean;
  imageIds?: string[];
}

export interface IProductVariantInput {
  title: string;
  isActive?: boolean;
  imageIds?: string[];
  options: IVariantOptionInput[];
}

export interface ICreateProductPayload {
  title: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  brand?: string;
  categoryId?: string | null;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock?: number;
  lowStockThreshold?: number;
  hasVariants?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metadata?: unknown;
  imageIds?: string[];
  variants?: IProductVariantInput[];
}

export interface IUpdateProductPayload extends Partial<ICreateProductPayload> {}

export interface IProductQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sort?: string;
  categoryId?: string;
  isActive?: string;
  hasVariants?: string;
  isFeatured?: string;
  brand?: string;
}
