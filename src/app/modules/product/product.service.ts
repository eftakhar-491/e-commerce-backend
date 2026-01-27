import { v4 as uuid } from "uuid";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";

import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
const searchableFields = ["title", "slug", "brand"];
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
//     images = [],
//     variants: inputVariants = [],
//   } = payload;
//   const DEFAULTPRODUCTVARIANT = {
//     title: "Default",
//     isActive: true,
//     options: [
//       {
//         sku: uuid(),
//         stock: inputVariants[0]?.options[0]?.stock || 0,
//         price: inputVariants[0]?.options[0]?.price || 0,
//         comparePrice: inputVariants[0]?.options[0]?.comparePrice || 0,
//         costPrice: inputVariants[0]?.options[0]?.costPrice || 0,
//         name: "Default Option",
//         value: "Default Value",
//         isActive: true,
//         images: [],
//       },
//     ],
//     images: [],
//   };
//   const variants =
//     !hasVariants || inputVariants.length === 0
//       ? [DEFAULTPRODUCTVARIANT]
//       : inputVariants;

//   const product = await prisma.$transaction(async (tx) => {
//     /* ----------------------------------------------------
//        1️⃣ VALIDATIONS (minimal queries)
//     ---------------------------------------------------- */

//     const [category, existingProduct] = await Promise.all([
//       tx.category.findUnique({
//         where: { id: categoryId },
//         select: { id: true },
//       }),
//       tx.product.findUnique({
//         where: { slug },
//         select: { id: true },
//       }),
//     ]);

//     if (!category) {
//       throw new AppError(httpStatus.NOT_FOUND, "Category not found");
//     }

//     if (existingProduct) {
//       throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
//     }

//     /* ----------------------------------------------------
//        2️⃣ CREATE PRODUCT
//     ---------------------------------------------------- */

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

//     /* ----------------------------------------------------
//        3️⃣ PRODUCT IMAGES (BULK)
//     ---------------------------------------------------- */

//     if (images.length) {
//       await tx.productImage.createMany({
//         data: images.map((img: any) => ({
//           src: img.path || img.src || "",
//           altText: img.altText || "",
//           publicId: img.filename || img.publicId || "",
//           isPrimary: img.isPrimary || img.isPrimary === "true",
//           productId: product.id,
//         })),
//       });
//     }

//     /* ----------------------------------------------------
//        4️⃣ VARIANTS + OPTIONS (OPTIMIZED)
//     ---------------------------------------------------- */

//     if (!hasVariants || !variants.length) {
//       return product;
//     }

//     /* ---- 4.1 Create Variants (parallel, IDs needed) ---- */

//     const createdVariants = await Promise.all(
//       variants.map((variant: any) =>
//         tx.productVariant.create({
//           data: {
//             productId: product.id,
//             title: variant.title,
//             isActive: variant.isActive === "true",
//           },
//         }),
//       ),
//     );

//     /* ---- 4.2 Prepare Variant Options (bulk) ---- */

//     const optionPayload: any[] = [];

//     variants.forEach((variant: any, vIndex: number) => {
//       const variantId = createdVariants[vIndex].id;

//       variant.options.forEach((option: any) => {
//         optionPayload.push({
//           productVariantId: variantId,
//           sku: option.sku,
//           stock: option.stock,
//           price: option.price,
//           comparePrice: option.comparePrice,
//           costPrice: option.costPrice,
//           name: option.name,
//           value: option.value,
//           isActive: option.isActive === "true",
//         });
//       });
//     });

//     if (optionPayload.length) {
//       await tx.variantOption.createMany({
//         data: optionPayload,
//       });
//     }

//     /* ---- 4.3 Fetch Options ONCE (needed for images) ---- */

//     const createdOptions = await tx.variantOption.findMany({
//       where: {
//         productVariantId: {
//           in: createdVariants.map((v) => v.id),
//         },
//       },
//       select: {
//         id: true,
//         sku: true,
//         productVariantId: true,
//       },
//     });

//     /* ---- 4.4 Prepare Option Images (bulk) ---- */

//     const optionImagePayload: any[] = [];

//     variants.forEach((variant: any, vIndex: number) => {
//       const variantId = createdVariants[vIndex].id;

//       variant.options.forEach((option: any) => {
//         if (!option.images?.length) return;

//         const dbOption = createdOptions.find(
//           (o) => o.productVariantId === variantId && o.sku === option.sku,
//         );

//         if (!dbOption) return;

//         option.images.forEach((img: any) => {
//           optionImagePayload.push({
//             ...img,
//             variantOptionId: dbOption.id,
//           });
//         });
//       });
//     });

//     if (optionImagePayload.length) {
//       await tx.productImage.createMany({
//         data: optionImagePayload,
//       });
//     }

//     /* ----------------------------------------------------
//        5️⃣ DONE
//     ---------------------------------------------------- */

//     return product;
//   });

//   return await prisma.product.findUnique({
//     where: { id: product.id },

//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       description: true,
//       shortDesc: true,
//       categoryId: true,
//       brand: true,
//       hasVariants: true,
//       isActive: true,
//       isFeatured: true,
//       createdAt: true,
//       updatedAt: true,

//       images: {
//         select: {
//           id: true,
//           src: true,
//           altText: true,
//           isPrimary: true,
//         },
//       },

//       variants: {
//         select: {
//           id: true,
//           title: true,
//           isActive: true,

//           options: {
//             select: {
//               id: true,
//               sku: true,
//               stock: true,
//               price: true,
//               comparePrice: true,
//               costPrice: true,
//               name: true,
//               value: true,
//               isActive: true,

//               images: {
//                 select: {
//                   id: true,
//                   src: true,
//                   altText: true,
//                   isPrimary: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });
// };

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
//     images = [], // 🔥 uploaded image IDs
//     variants: inputVariants = [],
//   } = payload;

//   const DEFAULTPRODUCTVARIANT = {
//     title: "Default",
//     isActive: true,
//     options: [
//       {
//         sku: uuid(),
//         stock: inputVariants[0]?.options?.[0]?.stock || 0,
//         price: inputVariants[0]?.options?.[0]?.price || 0,
//         comparePrice: inputVariants[0]?.options?.[0]?.comparePrice || 0,
//         costPrice: inputVariants[0]?.options?.[0]?.costPrice || 0,
//         name: "Default Option",
//         value: "Default Value",
//         isActive: true,
//         images: [],
//       },
//     ],
//     images: [],
//   };

//   const variants =
//     !hasVariants || inputVariants.length === 0
//       ? [DEFAULTPRODUCTVARIANT]
//       : inputVariants;

//   return prisma.$transaction(async (tx) => {
//     /* ----------------------------------------------------
//        1️⃣ VALIDATION
//     ---------------------------------------------------- */

//     const [category, existingProduct] = await Promise.all([
//       tx.category.findUnique({
//         where: { id: categoryId },
//         select: { id: true },
//       }),
//       tx.product.findUnique({
//         where: { slug },
//         select: { id: true },
//       }),
//     ]);

//     if (!category && categoryId) {
//       throw new AppError(httpStatus.NOT_FOUND, "Category not found");
//     }

//     if (existingProduct) {
//       throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
//     }

//     /* ----------------------------------------------------
//        2️⃣ CREATE PRODUCT
//     ---------------------------------------------------- */

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

//     /* ----------------------------------------------------
//        3️⃣ ATTACH EXISTING IMAGES TO PRODUCT
//     ---------------------------------------------------- */

//     if (images.length) {
//       const imageIds = images.map((img: any) => img.id).filter(Boolean);
//       await tx.productImage.updateMany({
//         where: {
//           id: { in: imageIds },
//           productId: null, // safety
//         },
//         data: {
//           productId: product.id,
//         },
//       });
//     }

//     /* ----------------------------------------------------
//        4️⃣ VARIANTS & OPTIONS
//     ---------------------------------------------------- */

//     if (!hasVariants || !variants.length) {
//       return product;
//     }

//     const createdVariants = await Promise.all(
//       variants.map((variant: any) =>
//         tx.productVariant.create({
//           data: {
//             productId: product.id,
//             title: variant.title,
//             isActive: variant.isActive === true || variant.isActive === "true",
//           },
//         }),
//       ),
//     );

//     const optionPayload: any[] = [];

//     variants.forEach((variant: any, vIndex: number) => {
//       const variantId = createdVariants[vIndex].id;

//       variant.options.forEach((option: any) => {
//         optionPayload.push({
//           productVariantId: variantId,
//           sku: option.sku || uuid(),
//           stock: option.stock,
//           price: option.price,
//           comparePrice: option.comparePrice,
//           costPrice: option.costPrice,
//           name: option.name,
//           value: option.value,
//           isActive: option.isActive === true || option.isActive === "true",
//         });
//       });
//     });

//     if (optionPayload.length) {
//       await tx.variantOption.createMany({ data: optionPayload });
//     }

//     /* ----------------------------------------------------
//        5️⃣ RETURN FULL PRODUCT
//     ---------------------------------------------------- */

//     return tx.product.findUnique({
//       where: { id: product.id },
//       include: {
//         images: true,
//         variants: {
//           include: {
//             options: true,
//           },
//         },
//       },
//     });
//   });
// };

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
//     images = [], // product images [{ id }]
//     variants: inputVariants = [],
//   } = payload;

//   const DEFAULTPRODUCTVARIANT = {
//     title: "Default",
//     isActive: true,
//     options: [
//       {
//         sku: uuid(),
//         stock: inputVariants[0]?.options?.[0]?.stock || 0,
//         price: inputVariants[0]?.options?.[0]?.price || 0,
//         comparePrice: inputVariants[0]?.options?.[0]?.comparePrice || 0,
//         costPrice: inputVariants[0]?.options?.[0]?.costPrice || 0,
//         name: "Default Option",
//         value: "Default Value",
//         isActive: true,
//         images: [],
//       },
//     ],
//   };

//   const variants =
//     !hasVariants || inputVariants.length === 0
//       ? [DEFAULTPRODUCTVARIANT]
//       : inputVariants;

//   return prisma.$transaction(async (tx) => {
//     /* ----------------------------------------------------
//        1️⃣ VALIDATION
//     ---------------------------------------------------- */

//     const [category, existingProduct] = await Promise.all([
//       categoryId
//         ? tx.category.findUnique({
//             where: { id: categoryId },
//             select: { id: true },
//           })
//         : null,
//       tx.product.findUnique({
//         where: { slug },
//         select: { id: true },
//       }),
//     ]);

//     if (categoryId && !category) {
//       throw new AppError(httpStatus.NOT_FOUND, "Category not found");
//     }

//     if (existingProduct) {
//       throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
//     }

//     /* ----------------------------------------------------
//        2️⃣ CREATE PRODUCT
//     ---------------------------------------------------- */

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

//     /* ----------------------------------------------------
//        3️⃣ ATTACH PRODUCT IMAGES
//     ---------------------------------------------------- */

//     if (images.length) {
//       const imageIds = images.map((img: any) => img.id).filter(Boolean);

//       if (imageIds.length) {
//         await tx.productImage.updateMany({
//           where: {
//             id: { in: imageIds },
//             productId: null,
//           },
//           data: {
//             productId: product.id,
//           },
//         });
//       }
//     }

//     /* ----------------------------------------------------
//        4️⃣ VARIANTS
//     ---------------------------------------------------- */

//     if (!hasVariants || !variants.length) {
//       return product;
//     }

//     const createdVariants = await Promise.all(
//       variants.map((variant: any) =>
//         tx.productVariant.create({
//           data: {
//             productId: product.id,
//             title: variant.title,
//             isActive: variant.isActive === true || variant.isActive === "true",
//           },
//         }),
//       ),
//     );

//     /* ----------------------------------------------------
//        5️⃣ VARIANT OPTIONS
//     ---------------------------------------------------- */

//     const optionPayload: any[] = [];

//     variants.forEach((variant: any, vIndex: number) => {
//       const variantId = createdVariants[vIndex].id;

//       variant.options.forEach((option: any) => {
//         optionPayload.push({
//           productVariantId: variantId,
//           sku: option.sku || uuid(),
//           stock: option.stock,
//           price: option.price,
//           comparePrice: option.comparePrice,
//           costPrice: option.costPrice,
//           name: option.name,
//           value: option.value,
//           isActive: option.isActive === true || option.isActive === "true",
//         });
//       });
//     });

//     if (optionPayload.length) {
//       await tx.variantOption.createMany({ data: optionPayload });
//     }

//     /* ----------------------------------------------------
//        6️⃣ ATTACH VARIANT OPTION IMAGES
//     ---------------------------------------------------- */

//     // Fetch created options once
//     const createdOptions = await tx.variantOption.findMany({
//       where: {
//         productVariantId: {
//           in: createdVariants.map((v) => v.id),
//         },
//       },
//       select: {
//         id: true,
//         sku: true,
//       },
//     });

//     // Map SKU -> optionId
//     const optionMap = new Map(createdOptions.map((o) => [o.sku, o.id]));

//     for (const variant of variants) {
//       for (const option of variant.options) {
//         if (!option.images?.length) continue;

//         const optionId = optionMap.get(option.sku);
//         if (!optionId) continue;

//         const imageIds = option.images
//           .map((img: any) => img.id)
//           .filter(Boolean);

//         if (!imageIds.length) continue;

//         await tx.productImage.updateMany({
//           where: {
//             id: { in: imageIds },
//             variantOptionId: null,
//           },
//           data: {
//             variantOptionId: optionId,
//           },
//         });
//       }
//     }

//     /* ----------------------------------------------------
//        7️⃣ RETURN FULL PRODUCT
//     ---------------------------------------------------- */

//     return tx.product.findUnique({
//       where: { id: product.id },
//       include: {
//         images: true,
//         variants: {
//           include: {
//             options: {
//               include: {
//                 images: true,
//               },
//             },
//           },
//         },
//       },
//     });
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
    images = [], // product images [{ id }]
    variants: inputVariants = [],
  } = payload;

  /* ----------------------------------------------------
     DEFAULT VARIANT (WHEN NO VARIANTS)
  ---------------------------------------------------- */

  const DEFAULTPRODUCTVARIANT = {
    title: "Default",
    isActive: true,
    options: [
      {
        sku: uuid(),
        stock: inputVariants[0]?.options?.[0]?.stock || 0,
        price: inputVariants[0]?.options?.[0]?.price || 0,
        comparePrice: inputVariants[0]?.options?.[0]?.comparePrice || 0,
        costPrice: inputVariants[0]?.options?.[0]?.costPrice || 0,
        name: "Default Option",
        value: "Default Value",
        isActive: true,
        images: [],
      },
    ],
  };

  const variants =
    !hasVariants || inputVariants.length === 0
      ? [DEFAULTPRODUCTVARIANT]
      : inputVariants;

  return prisma.$transaction(async (tx) => {
    /* ----------------------------------------------------
       1️⃣ VALIDATION
    ---------------------------------------------------- */

    const [category, existingProduct] = await Promise.all([
      categoryId
        ? tx.category.findUnique({
            where: { id: categoryId },
            select: { id: true },
          })
        : null,
      tx.product.findUnique({
        where: { slug },
        select: { id: true },
      }),
    ]);

    if (categoryId && !category) {
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
       3️⃣ ATTACH PRODUCT IMAGES
    ---------------------------------------------------- */

    if (images.length) {
      const imageIds = images.map((img: any) => img.id).filter(Boolean);

      if (imageIds.length) {
        await tx.productImage.updateMany({
          where: {
            id: { in: imageIds },
            productId: null,
          },
          data: {
            productId: product.id,
          },
        });
      }
    }

    /* ----------------------------------------------------
       4️⃣ VARIANTS (createMany)
    ---------------------------------------------------- */

    if (!hasVariants || !variants.length) {
      return product;
    }

    await tx.productVariant.createMany({
      data: variants.map((variant: any) => ({
        productId: product.id,
        title: variant.title,
        isActive: variant.isActive === true || variant.isActive === "true",
      })),
    });

    /* ----------------------------------------------------
       5️⃣ FETCH CREATED VARIANTS
    ---------------------------------------------------- */

    const createdVariants = await tx.productVariant.findMany({
      where: { productId: product.id },
      select: { id: true, title: true },
    });

    const variantMap = new Map(createdVariants.map((v) => [v.title, v.id]));

    /* ----------------------------------------------------
       6️⃣ VARIANT OPTIONS (createMany)
    ---------------------------------------------------- */

    const optionPayload: any[] = [];

    variants.forEach((variant: any) => {
      const variantId = variantMap.get(variant.title);
      if (!variantId) return;

      variant.options.forEach((option: any) => {
        optionPayload.push({
          productVariantId: variantId,
          sku: option.sku || uuid(),
          stock: option.stock,
          price: option.price,
          comparePrice: option.comparePrice,
          costPrice: option.costPrice,
          name: option.name,
          value: option.value,
          isActive: option.isActive === true || option.isActive === "true",
        });
      });
    });

    if (optionPayload.length) {
      await tx.variantOption.createMany({
        data: optionPayload,
      });
    }

    /* ----------------------------------------------------
       7️⃣ ATTACH VARIANT OPTION IMAGES
    ---------------------------------------------------- */

    const createdOptions = await tx.variantOption.findMany({
      where: {
        productVariantId: {
          in: createdVariants.map((v) => v.id),
        },
      },
      select: {
        id: true,
        sku: true,
      },
    });

    const optionMap = new Map(createdOptions.map((o) => [o.sku, o.id]));

    for (const variant of variants) {
      for (const option of variant.options) {
        if (!option.images?.length) continue;

        const optionId = optionMap.get(option.sku);
        if (!optionId) continue;

        const imageIds = option.images
          .map((img: any) => img.id)
          .filter(Boolean);

        if (!imageIds.length) continue;

        await tx.productImage.updateMany({
          where: {
            id: { in: imageIds },
            variantOptionId: null,
          },
          data: {
            variantOptionId: optionId,
          },
        });
      }
    }

    /* ----------------------------------------------------
       8️⃣ RETURN FULL PRODUCT
    ---------------------------------------------------- */

    return tx.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        variants: {
          include: {
            options: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  });
};

// const updateProduct = async (productId: string, payload: any) => {
//   return await prisma.$transaction(async (tx) => {
//     /* ----------------------------------------------------
//        1️⃣ CHECK PRODUCT EXISTS
//     ---------------------------------------------------- */
//     const existingProduct = await tx.product.findUnique({
//       where: { id: productId },
//       select: { id: true },
//     });

//     if (!existingProduct) {
//       throw new AppError(httpStatus.NOT_FOUND, "Product not found");
//     }

//     /* ----------------------------------------------------
//        2️⃣ VALIDATIONS (CONDITIONAL)
//     ---------------------------------------------------- */

//     if (payload.categoryId) {
//       const category = await tx.category.findUnique({
//         where: { id: payload.categoryId },
//         select: { id: true },
//       });

//       if (!category) {
//         throw new AppError(httpStatus.NOT_FOUND, "Category not found");
//       }
//     }

//     if (payload.slug) {
//       const slugExists = await tx.product.findFirst({
//         where: {
//           slug: payload.slug,
//           NOT: { id: productId },
//         },
//         select: { id: true },
//       });

//       if (slugExists) {
//         throw new AppError(httpStatus.CONFLICT, "Product slug already exists");
//       }
//     }

//     /* ----------------------------------------------------
//        3️⃣ UPDATE PRODUCT (ONLY PROVIDED FIELDS)
//     ---------------------------------------------------- */

//     const updateData: any = {};

//     const fields = [
//       "title",
//       "slug",
//       "description",
//       "shortDesc",
//       "categoryId",
//       "brand",
//       "hasVariants",
//       "isActive",
//       "isFeatured",
//     ];

//     fields.forEach((field) => {
//       if (payload[field] !== undefined) {
//         updateData[field] = payload[field];
//       }
//     });

//     await tx.product.update({
//       where: { id: productId },
//       data: updateData,
//     });

//     /* ----------------------------------------------------
//        4️⃣ UPDATE PRODUCT IMAGES (REPLACE IF PROVIDED)
//     ---------------------------------------------------- */

//     if (payload.images) {
//       await tx.productImage.deleteMany({
//         where: { productId },
//       });

//       if (payload.images.length) {
//         await tx.productImage.createMany({
//           data: payload.images.map((img: any) => ({
//             src: img.src || img.path,
//             altText: img.altText || "",
//             publicId: img.publicId || img.filename,
//             isPrimary: img.isPrimary ?? false,
//             productId,
//           })),
//         });
//       }
//     }

//     /* ----------------------------------------------------
//        5️⃣ UPDATE VARIANTS (REPLACE STRATEGY)
//     ---------------------------------------------------- */

//     if (payload.variants) {
//       // delete old tree
//       await tx.productVariant.deleteMany({
//         where: { productId },
//       });

//       if (payload.hasVariants && payload.variants.length) {
//         const createdVariants = await Promise.all(
//           payload.variants.map((variant: any) =>
//             tx.productVariant.create({
//               data: {
//                 productId,
//                 title: variant.title,
//                 isActive: variant.isActive,
//               },
//             }),
//           ),
//         );

//         const optionPayload: any[] = [];

//         payload.variants.forEach((variant: any, vIndex: number) => {
//           const variantId = createdVariants[vIndex].id;

//           variant.options.forEach((option: any) => {
//             optionPayload.push({
//               productVariantId: variantId,
//               sku: option.sku,
//               stock: option.stock,
//               price: option.price,
//               comparePrice: option.comparePrice,
//               costPrice: option.costPrice,
//               name: option.name,
//               value: option.value,
//               isActive: option.isActive,
//             });
//           });
//         });

//         if (optionPayload.length) {
//           await tx.variantOption.createMany({
//             data: optionPayload,
//           });
//         }
//       }
//     }

//     /* ----------------------------------------------------
//        6️⃣ RETURN UPDATED PRODUCT
//     ---------------------------------------------------- */

//     return tx.product.findUnique({
//       where: { id: productId },
//       select: {
//         id: true,
//         title: true,
//         slug: true,
//         description: true,
//         shortDesc: true,
//         categoryId: true,
//         brand: true,
//         hasVariants: true,
//         isActive: true,
//         isFeatured: true,
//         createdAt: true,
//         updatedAt: true,
//         images: true,
//         variants: {
//           include: {
//             options: {
//               include: { images: true },
//             },
//           },
//         },
//       },
//     });
//   });
// };

const updateProduct = async (productId: string, payload: any) => {
  return prisma.$transaction(async (tx) => {
    /* ----------------------------------------------------
       1️⃣ CHECK PRODUCT
    ---------------------------------------------------- */

    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    /* ----------------------------------------------------
       2️⃣ UPDATE PRODUCT FIELDS (PATCH STYLE)
    ---------------------------------------------------- */

    const productUpdate: any = {};
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
        productUpdate[field] = payload[field];
      }
    });

    if (Object.keys(productUpdate).length) {
      await tx.product.update({
        where: { id: productId },
        data: productUpdate,
      });
    }

    /* ----------------------------------------------------
       3️⃣ PRODUCT IMAGES (OPTIONAL)
    ---------------------------------------------------- */

    if (Array.isArray(payload.images)) {
      const imageIds = payload.images.map((i: any) => i.id).filter(Boolean);

      await tx.productImage.updateMany({
        where: { productId },
        data: { productId: null },
      });

      if (imageIds.length) {
        await tx.productImage.updateMany({
          where: {
            id: { in: imageIds },
            productId: null,
          },
          data: { productId },
        });
      }
    }

    /* ----------------------------------------------------
       4️⃣ VARIANTS (SMART UPDATE)
    ---------------------------------------------------- */

    if (!Array.isArray(payload.variants)) {
      return product;
    }

    const existingVariants = await tx.productVariant.findMany({
      where: { productId },
      include: { options: true },
    });

    const incomingVariantIds = payload.variants
      .map((v: any) => v.id)
      .filter(Boolean);

    /* ---- 4.1 DELETE REMOVED VARIANTS ---- */
    await tx.productVariant.deleteMany({
      where: {
        productId,
        id: { notIn: incomingVariantIds },
      },
    });

    /* ---- 4.2 UPSERT VARIANTS ---- */

    for (const variant of payload.variants) {
      let variantId = variant.id;

      if (variantId) {
        await tx.productVariant.update({
          where: { id: variantId },
          data: {
            title: variant.title,
            isActive: variant.isActive,
          },
        });
      } else {
        const created = await tx.productVariant.create({
          data: {
            productId,
            title: variant.title,
            isActive: variant.isActive,
          },
        });
        variantId = created.id;
      }

      /* ------------------------------------------------
         5️⃣ VARIANT OPTIONS (SMART UPDATE)
      ------------------------------------------------ */

      const existingOptions =
        existingVariants.find((v) => v.id === variantId)?.options || [];

      const incomingOptionIds = variant.options
        ?.map((o: any) => o.id)
        .filter(Boolean);

      // delete removed options
      await tx.variantOption.deleteMany({
        where: {
          productVariantId: variantId,
          id: { notIn: incomingOptionIds },
        },
      });

      for (const option of variant.options || []) {
        let optionId = option.id;

        if (optionId) {
          await tx.variantOption.update({
            where: { id: optionId },
            data: {
              name: option.name,
              value: option.value,
              sku: option.sku,
              stock: option.stock,
              price: option.price,
              comparePrice: option.comparePrice,
              costPrice: option.costPrice,
              isActive: option.isActive,
            },
          });
        } else {
          const createdOption = await tx.variantOption.create({
            data: {
              productVariantId: variantId,
              sku: option.sku || uuid(),
              name: option.name,
              value: option.value,
              stock: option.stock,
              price: option.price,
              comparePrice: option.comparePrice,
              costPrice: option.costPrice,
              isActive: option.isActive,
            },
          });
          optionId = createdOption.id;
        }

        /* --------------------------------------------
           6️⃣ OPTION IMAGES (UPDATE)
        -------------------------------------------- */

        if (Array.isArray(option.images)) {
          const imageIds = option.images.map((i: any) => i.id).filter(Boolean);

          await tx.productImage.updateMany({
            where: { variantOptionId: optionId },
            data: { variantOptionId: null },
          });

          if (imageIds.length) {
            await tx.productImage.updateMany({
              where: {
                id: { in: imageIds },
                variantOptionId: null,
              },
              data: { variantOptionId: optionId },
            });
          }
        }
      }
    }

    /* ----------------------------------------------------
       7️⃣ RETURN UPDATED PRODUCT
    ---------------------------------------------------- */

    return tx.product.findUnique({
      where: { id: productId },
      include: {
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

const getAllProducts = async (query: Record<string, string>) => {
  const qb = new QueryBuilder<any, any, any>(query)
    .filter()
    .search(searchableFields)
    .sort()
    .paginate();

  const prismaQuery = qb.build();

  const data = await prisma.product.findMany({
    ...prismaQuery,
    include: {
      images: true,
      variants: {
        include: {
          options: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  const meta = await qb.getMeta(prisma.product);

  return {
    meta,
    data,
  };
};

const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
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

  return product;
};

export const ProductServices = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
};
