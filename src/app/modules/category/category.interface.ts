export interface ICategory {
  id: string;

  name: string;
  slug: string;
  description?: string | null;

  parentId?: string | null;
  parent?: ICategory | null;
  children?: ICategory[];

  isActive: boolean;

  // products?: IProduct[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;

  parentId?: string;
  isActive?: boolean;
}
