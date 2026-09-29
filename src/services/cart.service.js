import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/endpoints";

export const addToCartService = async (
  productId,
  quantity = 1,
  variantId = null
) => {
  // 1. Clean product ID
  const cleanProductId =
    typeof productId === "object"
      ? productId?.id || productId?.product_id
      : productId;

  // 2. Clean variant ID
  const cleanVariantId =
    typeof variantId === "object"
      ? variantId?.id || variantId?.variant_id
      : variantId;

  // 3. Build payload
  const payload = {
    quantity: parseInt(quantity, 10) || 1,
  };

  // Only append variant_id if it's a non-empty, valid string UUID
  if (
    cleanVariantId &&
    typeof cleanVariantId === "string" &&
    cleanVariantId !== "[object Object]" &&
    cleanVariantId.trim() !== ""
  ) {
    payload.variant_id = cleanVariantId.trim();
  }

  try {
    const response = await api.post(
      API_ENDPOINTS.ADD_TO_CART(cleanProductId),
      payload
    );

    return response.data;
  } catch (error) {
    // Print FastAPI validation error array if present (error.response.data.detail)
    console.error(
      "422 Backend Validation Error:",
      error.response?.data?.detail || error.response?.data || error.message
    );
    throw error;
  }
};
export const getCartService = async (page = 1, pageSize = 20) => {
  const response = await api.get(API_ENDPOINTS.GET_CART, {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return response.data;
};

export const removeCartItemService = async (productId, variantId) => {
  // Extract primitive string IDs if objects were passed by mistake
  const cleanProductId =
    typeof productId === "object"
      ? productId?.id || productId?.product_id
      : productId;

  const cleanVariantId =
    typeof variantId === "object"
      ? variantId?.id || variantId?.variant_id
      : variantId;

  // DELETE request: /api/v1/customer/cart/remove/{product_id}/{variant_id}
  const response = await api.delete(
    API_ENDPOINTS.REMOVE_CART(cleanProductId, cleanVariantId)
  );

  return response.data;
};