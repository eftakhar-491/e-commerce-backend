import { randomUUID } from "crypto";
import httpStatus from "http-status-codes";
import { Prisma } from "../../../../generated/prisma/client";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { PaymentService } from "../payment/payment.service";
import type {
  TOrderStatus,
  TPaymentMethod,
  TPaymentStatus,
} from "../payment/payment.interface";
import type {
  ICreateOrderPayload,
  IOrderQuery,
  IUpdateOrderStatusPayload,
} from "./order.interface";

const orderStatusValues = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
] as const satisfies readonly TOrderStatus[];

const paymentStatusValues = [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
] as const satisfies readonly TPaymentStatus[];

const paymentMethodValues = [
  "CASH_ON_DELIVERY",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "CREDIT_CARD",
  "BANK_TRANSFER",
] as const satisfies readonly TPaymentMethod[];

const orderStatusSet = new Set<TOrderStatus>(orderStatusValues);
const paymentStatusSet = new Set<TPaymentStatus>(paymentStatusValues);
const paymentMethodSet = new Set<TPaymentMethod>(paymentMethodValues);

const orderPaymentSelect = {
  id: true,
  method: true,
  status: true,
  amount: true,
  transactionId: true,
  paidAt: true,
  errorMessage: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PaymentSelect;

const orderItemSelect = {
  id: true,
  orderId: true,
  variantOptionId: true,
  productId: true,
  productName: true,
  productSku: true,
  productImage: true,
  variantSnapshot: true,
  quantity: true,
  unitPrice: true,
  discountAmount: true,
  total: true,
  createdAt: true,
  option: {
    select: {
      id: true,
      sku: true,
      price: true,
      stock: true,
      isActive: true,
      variant: {
        select: {
          id: true,
          title: true,
          productId: true,
          isActive: true,
        },
      },
    },
  },
} satisfies Prisma.OrderItemSelect;

const orderSelect = {
  id: true,
  orderNumber: true,
  userId: true,
  shippingAddressId: true,
  billingAddress: true,
  status: true,
  notes: true,
  adminNotes: true,
  subtotal: true,
  discountTotal: true,
  shippingCost: true,
  tax: true,
  total: true,
  couponId: true,
  couponCode: true,
  placedAt: true,
  processedAt: true,
  shippedAt: true,
  deliveredAt: true,
  cancelledAt: true,
  returnedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  address: {
    select: {
      id: true,
      label: true,
      recipient: true,
      phone: true,
      street: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
    },
  },
  items: {
    orderBy: [{ createdAt: "asc" }],
    select: orderItemSelect,
  },
  payment: {
    select: orderPaymentSelect,
  },
  statusHistory: {
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      status: true,
      note: true,
      changedBy: true,
      createdAt: true,
    },
  },
} satisfies Prisma.OrderSelect;

const createOrderCartSelect = {
  id: true,
  userId: true,
  items: {
    orderBy: [{ createdAt: "asc" }],
    select: {
      id: true,
      productId: true,
      variantOptionId: true,
      quantity: true,
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          isActive: true,
          images: {
            where: { isPrimary: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              id: true,
              src: true,
            },
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
          variant: {
            select: {
              id: true,
              title: true,
              productId: true,
              isActive: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartSelect;

type TOrder = Prisma.OrderGetPayload<{ select: typeof orderSelect }>;
type TCreateOrderCart = Prisma.CartGetPayload<{ select: typeof createOrderCartSelect }>;

interface IPreparedOrderItem {
  productId: string;
  variantOptionId: string;
  quantity: number;
  productName: string;
  productSku: string;
  productImage: string | null;
  variantSnapshot: Prisma.InputJsonValue;
  unitPrice: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  total: Prisma.Decimal;
  previousStock: number;
}

const orderStatusTransitions: Record<TOrderStatus, TOrderStatus[]> = {
  PENDING: ["PROCESSING", "CONFIRMED", "CANCELLED"],
  PROCESSING: ["CONFIRMED", "SHIPPED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED", "REFUNDED"],
  CANCELLED: [],
  RETURNED: ["REFUNDED"],
  REFUNDED: [],
};

const orderSortableFields = ["createdAt", "placedAt", "total", "status"] as const;

const decimalFrom = (value: Prisma.Decimal | number | null | undefined) => {
  if (value instanceof Prisma.Decimal) {
    return value;
  }

  if (value === null || value === undefined) {
    return new Prisma.Decimal(0);
  }

  return new Prisma.Decimal(value);
};

const parseOrderStatus = (value: string, key: string): TOrderStatus => {
  const normalized = value.trim().toUpperCase() as TOrderStatus;

  if (!orderStatusSet.has(normalized)) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} has an invalid value`);
  }

  return normalized;
};

const parsePaymentStatus = (value: string): TPaymentStatus => {
  const normalized = value.trim().toUpperCase() as TPaymentStatus;

  if (!paymentStatusSet.has(normalized)) {
    throw new AppError(httpStatus.BAD_REQUEST, "paymentStatus has an invalid value");
  }

  return normalized;
};

const parsePaymentMethod = (value: string): TPaymentMethod => {
  const normalized = value.trim().toUpperCase() as TPaymentMethod;

  if (!paymentMethodSet.has(normalized)) {
    throw new AppError(httpStatus.BAD_REQUEST, "paymentMethod has an invalid value");
  }

  return normalized;
};

const parseDateQuery = (value: string | undefined, key: string) => {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, `${key} must be a valid date`);
  }

  return parsedDate;
};

const getPagination = (query: IOrderQuery) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildOrderBy = (sort: string | undefined): Prisma.OrderOrderByWithRelationInput[] => {
  if (!sort?.trim()) {
    return [{ placedAt: "desc" }];
  }

  const orderBy = sort
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const direction = field.startsWith("-") ? "desc" : "asc";
      const normalizedField = field.replace(/^-/, "");

      if (!orderSortableFields.includes(normalizedField as (typeof orderSortableFields)[number])) {
        return null;
      }

      return {
        [normalizedField]: direction,
      } as Prisma.OrderOrderByWithRelationInput;
    })
    .filter((value): value is Prisma.OrderOrderByWithRelationInput => value !== null);

  if (!orderBy.length) {
    return [{ placedAt: "desc" }];
  }

  return orderBy;
};

const buildOrderWhere = (
  query: IOrderQuery,
  userId?: string,
): Prisma.OrderWhereInput => {
  const where: Prisma.OrderWhereInput = {};
  const paymentWhere: Prisma.PaymentWhereInput = {};

  if (userId) {
    where.userId = userId;
  }

  if (query.userId && !userId) {
    where.userId = query.userId;
  }

  if (query.status) {
    where.status = parseOrderStatus(query.status, "status");
  }

  if (query.paymentStatus) {
    paymentWhere.status = parsePaymentStatus(query.paymentStatus);
  }

  if (query.paymentMethod) {
    paymentWhere.method = parsePaymentMethod(query.paymentMethod);
  }

  if (Object.keys(paymentWhere).length > 0) {
    where.payment = {
      is: paymentWhere,
    };
  }

  const fromDate = parseDateQuery(query.fromDate, "fromDate");
  const toDate = parseDateQuery(query.toDate, "toDate");

  if (fromDate || toDate) {
    where.placedAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  if (query.searchTerm?.trim()) {
    const searchTerm = query.searchTerm.trim();

    where.OR = [
      {
        orderNumber: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        couponCode: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        items: {
          some: {
            productName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  return where;
};

const generateOrderNumber = () => {
  const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = randomUUID().split("-")[0]?.toUpperCase() ?? "00000000";

  return `ORD-${datePrefix}-${randomSuffix}`;
};

const getUniqueOrderNumber = async (tx: Prisma.TransactionClient) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const orderNumber = generateOrderNumber();
    const existing = await tx.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });

    if (!existing) {
      return orderNumber;
    }
  }

  throw new AppError(
    httpStatus.SERVICE_UNAVAILABLE,
    "Unable to generate unique order number",
  );
};

const ensureShippingAddressBelongsToUser = async (
  tx: Prisma.TransactionClient,
  userId: string,
  shippingAddressId: string,
) => {
  const address = await tx.address.findFirst({
    where: {
      id: shippingAddressId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!address) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Shipping address not found for this user",
    );
  }
};

const validateAndPrepareOrderItems = (cart: TCreateOrderCart) => {
  if (!cart.items.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  let subtotal = new Prisma.Decimal(0);

  const preparedItems = cart.items.map((item): IPreparedOrderItem => {
    if (item.option.variant.productId !== item.productId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cart item contains mismatched product and variant option",
      );
    }

    if (!item.product.isActive) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Product '${item.product.title}' is inactive`,
      );
    }

    if (!item.option.variant.isActive) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Variant '${item.option.variant.title}' is inactive`,
      );
    }

    if (!item.option.isActive) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Variant option '${item.option.sku}' is inactive`,
      );
    }

    if (item.option.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for SKU '${item.option.sku}'`,
      );
    }

    if (item.product.price === null) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Base price is missing for product '${item.product.title}'`,
      );
    }

    const basePrice = decimalFrom(item.product.price);
    const variantAdditionalPrice = decimalFrom(item.option.price);
    const unitPrice = basePrice.add(variantAdditionalPrice);
    const total = unitPrice.mul(item.quantity);
    subtotal = subtotal.add(total);

    return {
      productId: item.product.id,
      variantOptionId: item.option.id,
      quantity: item.quantity,
      productName: item.product.title,
      productSku: item.option.sku,
      productImage: item.product.images[0]?.src ?? null,
      variantSnapshot: {
        variantId: item.option.variant.id,
        variantTitle: item.option.variant.title,
        optionId: item.option.id,
        optionSku: item.option.sku,
      } as Prisma.InputJsonValue,
      unitPrice,
      discountAmount: new Prisma.Decimal(0),
      total,
      previousStock: item.option.stock,
    };
  });

  return {
    preparedItems,
    subtotal,
  };
};

const clearCartAfterOrder = async (tx: Prisma.TransactionClient, cartId: string) => {
  await tx.cartItem.deleteMany({
    where: {
      cartId,
    },
  });

  await tx.cart.update({
    where: { id: cartId },
    data: {
      totalPrice: new Prisma.Decimal(0),
    },
  });
};

const restockOrderItems = async (
  tx: Prisma.TransactionClient,
  orderId: string,
  orderNumber: string,
  items: { variantOptionId: string; quantity: number }[],
  type: "CANCELLATION" | "RETURN",
  changedBy: string,
) => {
  for (const item of items) {
    const option = await tx.variantOption.findUnique({
      where: {
        id: item.variantOptionId,
      },
      select: {
        id: true,
        stock: true,
      },
    });

    if (!option) {
      throw new AppError(httpStatus.NOT_FOUND, "Variant option not found");
    }

    const previousStock = option.stock;
    const newStock = previousStock + item.quantity;

    await tx.variantOption.update({
      where: { id: option.id },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    });

    await tx.inventoryTransaction.create({
      data: {
        variantOptionId: option.id,
        type,
        quantity: item.quantity,
        previousStock,
        newStock,
        referenceId: orderId,
        referenceType: "order",
        note: `Stock restored due to ${type.toLowerCase()} for order ${orderNumber}`,
        createdBy: changedBy,
      },
    });
  }
};

const createOrderFromCart = async (userId: string, payload: ICreateOrderPayload) => {
  const order = await prisma.$transaction(async (tx) => {
    await ensureShippingAddressBelongsToUser(tx, userId, payload.shippingAddressId);

    const cart = await tx.cart.findUnique({
      where: {
        userId,
      },
      select: createOrderCartSelect,
    });

    if (!cart) {
      throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
    }

    const { preparedItems, subtotal } = validateAndPrepareOrderItems(cart);
    const discountTotal = new Prisma.Decimal(0);
    const shippingCost = decimalFrom(payload.shippingCost ?? 0);
    const tax = decimalFrom(payload.tax ?? 0);
    const total = subtotal.sub(discountTotal).add(shippingCost).add(tax);
    const orderNumber = await getUniqueOrderNumber(tx);

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddressId: payload.shippingAddressId,
        ...(payload.billingAddress && {
          billingAddress: payload.billingAddress as Prisma.InputJsonValue,
        }),
        status: "PENDING",
        notes: payload.notes ?? null,
        subtotal,
        discountTotal,
        shippingCost,
        tax,
        total,
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    for (const item of preparedItems) {
      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          variantOptionId: item.variantOptionId,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          productImage: item.productImage,
          variantSnapshot: item.variantSnapshot,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount,
          total: item.total,
        },
      });

      const updated = await tx.variantOption.updateMany({
        where: {
          id: item.variantOptionId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updated.count === 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for SKU '${item.productSku}'`,
        );
      }

      await tx.inventoryTransaction.create({
        data: {
          variantOptionId: item.variantOptionId,
          type: "SALE",
          quantity: -item.quantity,
          previousStock: item.previousStock,
          newStock: item.previousStock - item.quantity,
          referenceId: createdOrder.id,
          referenceType: "order",
          note: `Stock deducted for order ${createdOrder.orderNumber}`,
          createdBy: userId,
        },
      });
    }

    await PaymentService.createOrderPayment(tx, {
      orderId: createdOrder.id,
      method: payload.paymentMethod,
      amount: total,
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: createdOrder.id,
        status: "PENDING",
        note: "Order placed",
        changedBy: userId,
      },
    });

    await clearCartAfterOrder(tx, cart.id);

    const fullOrder = await tx.order.findUnique({
      where: {
        id: createdOrder.id,
      },
      select: orderSelect,
    });

    if (!fullOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    return fullOrder;
  });

  if (order.payment?.method === "CASH_ON_DELIVERY") {
    try {
      await PaymentService.sendInvoiceEmailForOrder(order.id);
    } catch (error) {
      console.error("Failed to send COD invoice email", error);
    }
  }

  return order;
};

const getMyOrders = async (userId: string, query: IOrderQuery) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildOrderWhere(query, userId);

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit,
      select: orderSelect,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const getMyOrderById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: orderSelect,
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

const getAllOrders = async (query: IOrderQuery) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildOrderWhere(query);

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit,
      select: orderSelect,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const getOrderByIdForAdmin = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: orderSelect,
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

const ensureStatusTransition = (
  currentStatus: TOrderStatus,
  nextStatus: TOrderStatus,
) => {
  if (currentStatus === nextStatus) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order already has this status");
  }

  const allowedNextStatuses = orderStatusTransitions[currentStatus];

  if (!allowedNextStatuses.includes(nextStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot transition order status from ${currentStatus} to ${nextStatus}`,
    );
  }
};

const updateOrderStatus = async (
  orderId: string,
  payload: IUpdateOrderStatusPayload,
  changedBy: string,
) => {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        items: {
          select: {
            variantOptionId: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    const currentStatus = order.status as TOrderStatus;
    ensureStatusTransition(currentStatus, payload.status);

    const now = new Date();
    const updateData: Prisma.OrderUncheckedUpdateInput = {
      status: payload.status,
    };

    if (payload.status === "PROCESSING") {
      updateData.processedAt = now;
    }

    if (payload.status === "SHIPPED") {
      updateData.shippedAt = now;
    }

    if (payload.status === "DELIVERED") {
      updateData.deliveredAt = now;
    }

    if (payload.status === "CANCELLED") {
      updateData.cancelledAt = now;
    }

    if (payload.status === "RETURNED") {
      updateData.returnedAt = now;
    }

    await tx.order.update({
      where: { id: order.id },
      data: updateData,
    });

    if (payload.status === "CANCELLED") {
      await restockOrderItems(
        tx,
        order.id,
        order.orderNumber,
        order.items,
        "CANCELLATION",
        changedBy,
      );
    }

    if (payload.status === "RETURNED") {
      await restockOrderItems(
        tx,
        order.id,
        order.orderNumber,
        order.items,
        "RETURN",
        changedBy,
      );
    }

    await PaymentService.syncPaymentWithOrderStatus(tx, order.id, payload.status);

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: payload.status,
        note: payload.note ?? null,
        changedBy,
      },
    });

    const fullOrder = await tx.order.findUnique({
      where: {
        id: order.id,
      },
      select: orderSelect,
    });

    if (!fullOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    return fullOrder;
  });

  return updatedOrder;
};

export const OrderService = {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderByIdForAdmin,
  updateOrderStatus,
};
