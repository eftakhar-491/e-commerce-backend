import fs from "fs/promises";
import path from "path";
import cloudinary from "../lib/cloudinary";
import { getSupabaseBucket, getSupabaseClient } from "../lib/supabase";

export const cleanupImages = async (
  images?:
    | {
        storageType: "link" | "local" | "cloudinary" | "supabase";
        src?: string;
        publicId?: string;
      }[]
    | undefined,
) => {
  if (!images) return;
  if (!images?.length) return;

  for (const image of images) {
    try {
      if (image.storageType === "local") {
        let localPath = image.src;

        if (image.publicId?.startsWith("local:")) {
          const filename = image.publicId.replace("local:", "");
          localPath = path.join(process.cwd(), "uploads/media", filename);
        } else if (image.src?.startsWith("/api/uploads/media/")) {
          const filename = image.src.replace("/api/uploads/media/", "");
          localPath = path.join(process.cwd(), "uploads/media", filename);
        }

        if (localPath) {
          await fs.unlink(localPath);
        }
      }

      if (image.storageType === "cloudinary" && image.publicId) {
        const cloudinaryPublicId = image.publicId.startsWith("cloudinary:")
          ? image.publicId.replace("cloudinary:", "")
          : image.publicId;
        await cloudinary.uploader.destroy(cloudinaryPublicId, {
          resource_type: "auto",
        });
      }

      if (image.storageType === "supabase" && image.publicId) {
        const supabase = getSupabaseClient();
        const bucket = getSupabaseBucket();
        const objectPath = image.publicId.startsWith("supabase:")
          ? image.publicId.replace("supabase:", "")
          : image.publicId;

        await supabase.storage.from(bucket).remove([objectPath]);
      }
    } catch (err) {
      console.error("Failed to cleanup image:", err);
    }
  }
};

// import fs from "fs/promises";
// import cloudinary from "../lib/cloudinary";

// type CleanupPayload = {
//   storageType?: "local" | "cloudinary" | "custom";
//   src?: string;
//   publicId?: string;
// };

// export const cleanupImage = async (image?: CleanupPayload) => {
//   if (!image || image.storageType === "custom") return;

//   try {
//     if (image.storageType === "local" && image.src) {
//       await fs.unlink(image.src);
//     }

//     if (image.storageType === "cloudinary" && image.publicId) {
//       await cloudinary.uploader.destroy(image.publicId);
//     }
//   } catch (err) {
//     console.error("Image cleanup failed:", err);
//   }
// };
