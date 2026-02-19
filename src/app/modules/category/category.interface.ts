export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  images?: {
    id: string;
    src: string;
    publicId: string | null;
    altText: string | null;
    sortOrder: number;
    isPrimary: boolean;
  }[];
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageIds?: string[];
  isActive?: boolean;
  sortOrder?: number;
  parentId?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  imageIds?: string[];
  isActive?: boolean;
  sortOrder?: number;
  parentId?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface ICollectionProduct {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  brand: string | null;
  price: unknown;
  compareAtPrice: unknown;
  hasVariants: boolean;
  isFeatured: boolean;
  images: {
    id: string;
    src: string;
    altText: string | null;
    isPrimary: boolean;
  }[];
}

export interface ICategoryCollectionNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  products: ICollectionProduct[];
  children: ICategoryCollectionNode[];
}
