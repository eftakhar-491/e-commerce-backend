import httpStatus from "http-status-codes";
import { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  IAddCartItemPayload,
  IUpdateCartItemPayload,
} from "./cart.interface";

const cartItemImageSelect = {
  id: true,
  src: true,
  altText: true,
  isPrimary: true,
  sortOrder: true,
} satisfies Prisma.ProductImageSelect;

const cartSelect = {
  id: true,
  userId: true,
  totalPrice: true,
  createdAt: true,
  updatedAt: true,
  items: {
    orderBy: [{ createdAt: "asc" }],
    select: {
      id: true,
      cartId: true,
      productId: true,
      variantOptionId: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          isActive: true,
          images: {
            where: {
              isPrimary: true,
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: cartItemImageSelect,
          },
        },
      },
      option: {
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          isActive: true,
          images: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            select: cartItemImageSelect,
          },
          variant: {
            select: {
              id: true,
              title: true,
              isActive: true,
              productId: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartSelect;

type TCart = Prisma.CartGetPayload<{
  select: typeof cartSelect;
}>;

const decimalFrom = (value: Prisma.Decimal | number | null | undefined) => {
  if (value instanceof Prisma.Decimal) {
    return value;
  }

  if (value === null || value === undefined) {
    return new Prisma.Decimal(0);
  }

  return new Prisma.Decimal(value);
};

const toMoneyString = (value: Prisma.Decimal) => value.toFixed(2);

const computeUnitPrice = (item: TCart["items"][number]) => {
  const basePrice = decimalFrom(item.product.price);
  const variantAdditionalPrice = decimalFrom(item.option.price);
  const unitPrice = basePrice.add(variantAdditionalPrice);

  return {
    basePrice,
    variantAdditionalPrice,
    unitPrice,
  };
};

const mapCartResponse = (cart: TCart) => {
  const items = cart.items.map((item) => {
    const { basePrice, variantAdditionalPrice, unitPrice } = computeUnitPrice(item);
    const lineTotal = unitPrice.mul(item.quantity);

    return {
      ...item,
      pricing: {
        basePrice: toMoneyString(basePrice),
        variantAdditionalPrice: toMoneyString(variantAdditionalPrice),
        unitPrice: toMoneyString(unitPrice),
        lineTotal: toMoneyString(lineTotal),
      },
    };
  });

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    totalPrice: toMoneyString(decimalFrom(cart.totalPrice)),
    totalItems,
    items,
  };
};

const getOrCreateCart = async (
  tx: Prisma.TransactionClient,
  userId: string,
) => {
  const cart = await tx.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: {
      id: true,
    },
  });

  return cart;
};

const refreshCartTotalPrice = async (
  tx: Prisma.TransactionClient,
  cartId: string,
) => {
  const cartItems = await tx.cartItem.findMany({
    where: { cartId },
    select: {
      quantity: true,
      option: {
        select: {
          price: true,
          variant: {
            select: {
              product: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let totalPrice = new Prisma.Decimal(0);

  cartItems.forEach((item) => {
    const basePrice = decimalFrom(item.option.variant.product.price);
    const variantAdditionalPrice = decimalFrom(item.option.price);
    const lineTotal = basePrice.add(variantAdditionalPrice).mul(item.quantity);
    totalPrice = totalPrice.add(lineTotal);
  });

  await tx.cart.update({
    where: { id: cartId },
    data: {
      totalPrice,
    },
  });
};

const getOptionForCart = async (variantOptionId: string) => {
  const option = await prisma.variantOption.findUnique({
    where: {
      id: variantOptionId,
    },
    select: {
      id: true,
      stock: true,
      isActive: true,
      variant: {
        select: {
          id: true,
          title: true,
          productId: true,
          isActive: true,
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              isActive: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!option) {
    throw new AppError(httpStatus.NOT_FOUND, "Variant option not found");
  }

  return option;
};

const ensureOptionCanBeAdded = (
  payload: IAddCartItemPayload,
  option: Awaited<ReturnType<typeof getOptionForCart>>,
) => {
  if (option.variant.productId !== payload.productId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Selected variant option does not belong to the provided product",
    );
  }

  if (!option.variant.product.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product is inactive");
  }

  if (!option.variant.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Variant is inactive");
  }

  if (!option.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Variant option is inactive");
  }
};

const ensureStockAvailable = (
  stock: number,
  quantity: number,
  actionLabel: string,
) => {
  if (stock < quantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Insufficient stock to ${actionLabel}. Available stock is ${stock}`,
    );
  }
};

const getMyCart = async (userId: string) => {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: cartSelect,
  });

  return mapCartResponse(cart);
};

const addItemToCart = async (userId: string, payload: IAddCartItemPayload) => {
  const quantity = payload.quantity ?? 1;
  const option = await getOptionForCart(payload.variantOptionId);
  ensureOptionCanBeAdded(payload, option);

  const updatedCart = await prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(tx, userId);
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_variantOptionId: {
          cartId: cart.id,
          variantOptionId: payload.variantOptionId,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;
      ensureStockAvailable(option.stock, nextQuantity, "increase cart item quantity");

      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: nextQuantity,
          productId: payload.productId,
        },
      });
    } else {
      ensureStockAvailable(option.stock, quantity, "add this item");

      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId: payload.productId,
          variantOptionId: payload.variantOptionId,
          quantity,
        },
      });
    }

    await refreshCartTotalPrice(tx, cart.id);

    const fullCart = await tx.cart.findUnique({
      where: { id: cart.id },
      select: cartSelect,
    });

    if (!fullCart) {
      throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
    }

    return fullCart;
  });

  return mapCartResponse(updatedCart);
};

const updateCartItemQuantity = async (
  userId: string,
  itemId: string,
  payload: IUpdateCartItemPayload,
) => {
  const updatedCart = await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
      select: {
        id: true,
        cartId: true,
        option: {
          select: {
            stock: true,
            isActive: true,
            variant: {
              select: {
                isActive: true,
                product: {
                  select: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cartItem) {
      throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
    }

    if (!cartItem.option.variant.product.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product is inactive");
    }

    if (!cartItem.option.variant.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Variant is inactive");
    }

    if (!cartItem.option.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Variant option is inactive");
    }

    ensureStockAvailable(cartItem.option.stock, payload.quantity, "update quantity");

    await tx.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: payload.quantity,
      },
    });

    await refreshCartTotalPrice(tx, cartItem.cartId);

    const fullCart = await tx.cart.findUnique({
      where: { id: cartItem.cartId },
      select: cartSelect,
    });

    if (!fullCart) {
      throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
    }

    return fullCart;
  });

  return mapCartResponse(updatedCart);
};

const removeCartItem = async (userId: string, itemId: string) => {
  const updatedCart = await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
      select: {
        id: true,
        cartId: true,
      },
    });

    if (!cartItem) {
      throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
    }

    await tx.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    await refreshCartTotalPrice(tx, cartItem.cartId);

    const fullCart = await tx.cart.findUnique({
      where: { id: cartItem.cartId },
      select: cartSelect,
    });

    if (!fullCart) {
      throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
    }

    return fullCart;
  });

  return mapCartResponse(updatedCart);
};

const clearMyCart = async (userId: string) => {
  const clearedCart = await prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(tx, userId);

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    await tx.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        totalPrice: new Prisma.Decimal(0),
      },
    });

    const fullCart = await tx.cart.findUnique({
      where: {
        id: cart.id,
      },
      select: cartSelect,
    });

    if (!fullCart) {
      throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
    }

    return fullCart;
  });

  return mapCartResponse(clearedCart);
};

export const CartService = {
  getMyCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearMyCart,
};
