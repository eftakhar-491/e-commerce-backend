import { prisma } from "../../lib/prisma";

const saveImage = async (imageData: {
  src: string;
  public_id: string;
  altText: string | null;
}) => {
  await prisma.productImage.create({
    data: {
      src: imageData.src,
      publicId: imageData.public_id,
      altText: imageData.altText,
    },
  });
};

export const ImageService = {
  saveImage,
};
