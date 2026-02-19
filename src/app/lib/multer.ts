import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import AppError from "../helper/AppError";
import httpStatus from "http-status-codes";

export const MAX_MEDIA_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const mediaLimits: multer.Options["limits"] = {
  fileSize: MAX_MEDIA_SIZE_BYTES,
};

export const CloudinaryStorageInstance = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "media",
    resource_type: "auto",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "mp4",
      "mov",
      "avi",
      "webm",
      "mkv",
    ],
  }),
});

export const uploadWithCloudinary = multer({
  storage: CloudinaryStorageInstance,
  limits: mediaLimits,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(process.cwd(), "uploads/media");
    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new AppError(httpStatus.BAD_REQUEST, "Only image/video files are allowed"));
  }
};

export const uploadCategoryImage = multer({
  storage,
  fileFilter,
  limits: mediaLimits,
});
export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: mediaLimits,
});

export const uploadForSupabase = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: mediaLimits,
});
