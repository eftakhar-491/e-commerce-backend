import multer from "multer";

import { storage } from "../lib/multer";

export const uploadWithCloudinary = multer({ storage });
