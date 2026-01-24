import type { IProductImage } from "../image/image.interface";

export interface ICategory {
  id: string;

  name: string;
  slug: string;
  description?: string | null;

  parentId?: string | null;
  parent?: ICategory | null;
  children?: ICategory[];
  images?: IProductImage[];
  isActive: boolean;

  // products?: IProduct[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  images?: IProductImage[];
  parentId?: string;
  isActive?: boolean;
}
