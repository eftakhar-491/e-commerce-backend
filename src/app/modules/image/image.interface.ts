export interface IProductImage {
  id: string;

  productId?: string | null;
  variantId?: string | null;
  variantOptionId?: string | null;
  categoryId?: string | null;

  src: string;
  publicId: string;
  altText?: string | null;
  isPrimary: boolean;

  createdAt: Date;
  updatedAt: Date;
}
