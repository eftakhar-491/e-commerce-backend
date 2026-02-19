export type MediaStorageType = "link" | "local" | "cloudinary" | "supabase";

export type MediaType = "image" | "video";

export interface IProductImage {
  id: string;
  productId?: string | null;
  variantId?: string | null;
  variantOptionId?: string | null;
  categoryId?: string | null;
  src: string;
  publicId?: string | null;
  altText?: string | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUploadedMedia {
  storageType: MediaStorageType;
  src: string;
  publicId?: string;
}

export interface ICreateMediaRequestBody {
  productId?: string;
  variantId?: string;
  variantOptionId?: string;
  categoryId?: string;
  altText?: string;
  isPrimary?: boolean;
  mediaUrl?: string;
  mediaUrls?: string[];
}

export interface ICreateMediaPayload {
  productId?: string;
  variantId?: string;
  variantOptionId?: string;
  categoryId?: string;
  images: {
    src: string;
    publicId?: string;
    altText?: string;
    isPrimary?: boolean;
  }[];
}
