import { v4 as uuid } from "uuid";
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
    variants: inputVariants = [],
  } = payload;
  const DEFAULTPRODUCTVARIANT = {
    title: "Default",
    isActive: true,
    options: [
      {
        sku: uuid(),
        stock: inputVariants[0]?.options[0]?.stock || 0,
        price: inputVariants[0]?.options[0]?.price || 0,
        comparePrice: inputVariants[0]?.options[0]?.comparePrice || 0,
        costPrice: inputVariants[0]?.options[0]?.costPrice || 0,
        name: "Default Option",
        value: "Default Value",
        isActive: true,
        images: [],
      },
    ],
    images: [],
  };
  const variants =
    !hasVariants || inputVariants.length === 0
      ? [DEFAULTPRODUCTVARIANT]
      : inputVariants;

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
          src: img.path || img.src || "",
          altText: img.altText || "",
          publicId: img.filename || img.publicId || "",
          isPrimary: img.isPrimary || img.isPrimary === "true",
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
            isActive: variant.isActive === "true",
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
          isActive: option.isActive === "true",
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
const updateProduct = async (productId: string, payload: any) => {
  return await prisma.$transaction(async (tx) => {
    /* ----------------------------------------------------
       1️⃣ CHECK PRODUCT EXISTS
    ---------------------------------------------------- */
    const existingProduct = await tx.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!existingProduct) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    /* ----------------------------------------------------
       2️⃣ VALIDATIONS (CONDITIONAL)
    ---------------------------------------------------- */

    if (payload.categoryId) {
      const category = await tx.category.findUnique({
        where: { id: payload.categoryId },
        select: { id: true },
      });

      if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
      }
    }

    if (payload.slug) {
      const slugExists = await tx.product.findFirst({
        where: {
          slug: payload.slug,
          NOT: { id: productId },
        },
        select: { id: true },
      });

      if (slugExists) {
        throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
      }
    }

    /* ----------------------------------------------------
       3️⃣ UPDATE PRODUCT (ONLY PROVIDED FIELDS)
    ---------------------------------------------------- */

    const updateData: any = {};

    const fields = [
      "title",
      "slug",
      "description",
      "shortDesc",
      "categoryId",
      "brand",
      "hasVariants",
      "isActive",
      "isFeatured",
    ];

    fields.forEach((field) => {
      if (payload[field] !== undefined) {
        updateData[field] = payload[field];
      }
    });

    await tx.product.update({
      where: { id: productId },
      data: updateData,
    });

    /* ----------------------------------------------------
       4️⃣ UPDATE PRODUCT IMAGES (REPLACE IF PROVIDED)
    ---------------------------------------------------- */

    if (payload.images) {
      await tx.productImage.deleteMany({
        where: { productId },
      });

      if (payload.images.length) {
        await tx.productImage.createMany({
          data: payload.images.map((img: any) => ({
            src: img.src || img.path,
            altText: img.altText || "",
            publicId: img.publicId || img.filename,
            isPrimary: img.isPrimary ?? false,
            productId,
          })),
        });
      }
    }

    /* ----------------------------------------------------
       5️⃣ UPDATE VARIANTS (REPLACE STRATEGY)
    ---------------------------------------------------- */

    if (payload.variants) {
      // delete old tree
      await tx.productVariant.deleteMany({
        where: { productId },
      });

      if (payload.hasVariants && payload.variants.length) {
        const createdVariants = await Promise.all(
          payload.variants.map((variant: any) =>
            tx.productVariant.create({
              data: {
                productId,
                title: variant.title,
                isActive: variant.isActive,
              },
            }),
          ),
        );

        const optionPayload: any[] = [];

        payload.variants.forEach((variant: any, vIndex: number) => {
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
      }
    }

    /* ----------------------------------------------------
       6️⃣ RETURN UPDATED PRODUCT
    ---------------------------------------------------- */

    return tx.product.findUnique({
      where: { id: productId },
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
        images: true,
        variants: {
          include: {
            options: {
              include: { images: true },
            },
          },
        },
      },
    });
  });
};

const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: {
      images: true,
      variants: {
        include: {
          images: true,
          options: {
            include: { images: true },
          },
        },
      },
    },
  });
};

const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      variants: {
        include: {
          images: true,
          options: {
            include: { images: true },
          },
        },
      },
    },
  });

  return product;
};

export const ProductServices = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
};
