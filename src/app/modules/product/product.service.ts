import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";

import httpStatus from "http-status-codes";

// const createProduct = async (payload: any) => {
//   const {
//     title,
//     slug,
//     description,
//     shortDesc,
//     categoryId,
//     brand,
//     hasVariants,
//     isActive,
//     isFeatured,
//     images,
//     variants,
//   } = payload;

//   // 🔒 Check category exists
//   const category = await prisma.category.findUnique({
//     where: { id: categoryId },
//   });

//   if (!category) {
//     throw new AppError(httpStatus.NOT_FOUND, "Category not found");
//   }

//   // 🔒 Check unique slug
//   const existing = await prisma.product.findUnique({
//     where: { slug },
//   });

//   if (existing) {
//     throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
//   }

//   // 🔁 Transaction (IMPORTANT)
//   return prisma.$transaction(async (tx) => {
//     // 1️⃣ Create Product
//     const product = await tx.product.create({
//       data: {
//         title,
//         slug,
//         description,
//         shortDesc,
//         categoryId,
//         brand,
//         hasVariants,
//         isActive,
//         isFeatured,
//       },
//     });

//     // 2️⃣ Product Images
//     if (images?.length) {
//       await tx.productImage.createMany({
//         data: images.map((img: any) => ({
//           ...img,
//           productId: product.id,
//         })),
//       });
//     }

//     // 3️⃣ Variants & Options
//     if (hasVariants && variants?.length) {
//       for (const variant of variants) {
//         const createdVariant = await tx.productVariant.create({
//           data: {
//             productId: product.id,
//             title: variant.title,
//             isActive: variant.isActive,
//           },
//         });

//         for (const option of variant.options) {
//           const createdOption = await tx.variantOption.create({
//             data: {
//               productVariantId: createdVariant.id,
//               sku: option.sku,
//               stock: option.stock,
//               price: option.price,
//               comparePrice: option.comparePrice,
//               costPrice: option.costPrice,
//               name: option.name,
//               value: option.value,
//               isActive: option.isActive,
//             },
//           });

//           // Option images
//           if (option.images?.length) {
//             await tx.productImage.createMany({
//               data: option.images.map((img: any) => ({
//                 ...img,
//                 variantOptionId: createdOption.id,
//               })),
//             });
//           }
//         }
//       }
//     }

//     return product;
//   });
// };

const createProduct = async (payload: any) => {
  const {
    title,
    slug,
    description,
    shortDesc,
    categoryId,
    brand,
    hasVariants,
    isActive,
    isFeatured,
    images = [],
    variants = [],
  } = payload;

  const product = await prisma.$transaction(async (tx) => {
    /* ----------------------------------------------------
       1️⃣ VALIDATIONS (minimal queries)
    ---------------------------------------------------- */

    const [category, existingProduct] = await Promise.all([
      tx.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      }),
      tx.product.findUnique({
        where: { slug },
        select: { id: true },
      }),
    ]);

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    if (existingProduct) {
      throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
    }

    /* ----------------------------------------------------
       2️⃣ CREATE PRODUCT
    ---------------------------------------------------- */

    const product = await tx.product.create({
      data: {
        title,
        slug,
        description,
        shortDesc,
        categoryId,
        brand,
        hasVariants,
        isActive,
        isFeatured,
      },
    });

    /* ----------------------------------------------------
       3️⃣ PRODUCT IMAGES (BULK)
    ---------------------------------------------------- */

    if (images.length) {
      await tx.productImage.createMany({
        data: images.map((img: any) => ({
          ...img,
          productId: product.id,
        })),
      });
    }

    /* ----------------------------------------------------
       4️⃣ VARIANTS + OPTIONS (OPTIMIZED)
    ---------------------------------------------------- */

    if (!hasVariants || !variants.length) {
      return product;
    }

    /* ---- 4.1 Create Variants (parallel, IDs needed) ---- */

    const createdVariants = await Promise.all(
      variants.map((variant: any) =>
        tx.productVariant.create({
          data: {
            productId: product.id,
            title: variant.title,
            isActive: variant.isActive,
          },
        }),
      ),
    );

    /* ---- 4.2 Prepare Variant Options (bulk) ---- */

    const optionPayload: any[] = [];

    variants.forEach((variant: any, vIndex: number) => {
      const variantId = createdVariants[vIndex].id;

      variant.options.forEach((option: any) => {
        optionPayload.push({
          productVariantId: variantId,
          sku: option.sku,
          stock: option.stock,
          price: option.price,
          comparePrice: option.comparePrice,
          costPrice: option.costPrice,
          name: option.name,
          value: option.value,
          isActive: option.isActive,
        });
      });
    });

    if (optionPayload.length) {
      await tx.variantOption.createMany({
        data: optionPayload,
      });
    }

    /* ---- 4.3 Fetch Options ONCE (needed for images) ---- */

    const createdOptions = await tx.variantOption.findMany({
      where: {
        productVariantId: {
          in: createdVariants.map((v) => v.id),
        },
      },
      select: {
        id: true,
        sku: true,
        productVariantId: true,
      },
    });

    /* ---- 4.4 Prepare Option Images (bulk) ---- */

    const optionImagePayload: any[] = [];

    variants.forEach((variant: any, vIndex: number) => {
      const variantId = createdVariants[vIndex].id;

      variant.options.forEach((option: any) => {
        if (!option.images?.length) return;

        const dbOption = createdOptions.find(
          (o) => o.productVariantId === variantId && o.sku === option.sku,
        );

        if (!dbOption) return;

        option.images.forEach((img: any) => {
          optionImagePayload.push({
            ...img,
            variantOptionId: dbOption.id,
          });
        });
      });
    });

    if (optionImagePayload.length) {
      await tx.productImage.createMany({
        data: optionImagePayload,
      });
    }

    /* ----------------------------------------------------
       5️⃣ DONE
    ---------------------------------------------------- */

    return product;
  });

  return await prisma.product.findUnique({
    where: { id: product.id },

    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      shortDesc: true,
      categoryId: true,
      brand: true,
      hasVariants: true,
      isActive: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,

      images: {
        select: {
          id: true,
          src: true,
          altText: true,
          isPrimary: true,
        },
      },

      variants: {
        select: {
          id: true,
          title: true,
          isActive: true,

          options: {
            select: {
              id: true,
              sku: true,
              stock: true,
              price: true,
              comparePrice: true,
              costPrice: true,
              name: true,
              value: true,
              isActive: true,

              images: {
                select: {
                  id: true,
                  src: true,
                  altText: true,
                  isPrimary: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const ProductServices = {
  createProduct,
};
