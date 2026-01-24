import { catchAsync } from "../../utils/catchAsync";

import httpStatus from "http-status-codes";
import { ProductServices } from "./product.service";
import { sendResponse } from "../../utils/sendResponse";

const createProduct = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await ProductServices.createProduct(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

export const ProductController = {
  createProduct,
};
