export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IProduct extends IBaseEntity {
  title: string;
  slug: string;
  description?: string;
  shortDesc?: string;

  categoryId: string;
  brand?: string;

  hasVariants: boolean;
  isActive: boolean;
  isFeatured: boolean;

  //   category?: ICategory;
  variants?: IProductVariant[];
  images?: IProductImage[];
  //   reviews?: IReview[];
  //   tags?: IProductTag[];
}

export interface IProductVariant extends IBaseEntity {
  productId: string;
  title: string;
  isActive: boolean;

  product?: IProduct;
  options?: IVariantOption[];
  images?: IProductImage[];
}

export interface IVariantOption extends IBaseEntity {
  productVariantId: string;

  sku: string;
  stock: number;

  price: number;
  comparePrice?: number;
  costPrice?: number;

  name: string;
  value: string;
  isActive: boolean;

  variant?: IProductVariant;
  images?: IProductImage[];

  //   cartItems?: ICartItem[];
  //   orderItems?: IOrderItem[];
}

export interface IProductImage {
  id: string;

  productId?: string;
  variantId?: string;
  variantOptionId?: string;

  src: string;
  altText?: string;
  isPrimary: boolean;

  product?: IProduct;
  variant?: IProductVariant;
  option?: IVariantOption;

  createdAt: Date;
}
