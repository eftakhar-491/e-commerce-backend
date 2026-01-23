import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});
