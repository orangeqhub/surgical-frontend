import Cookies from "js-cookie";
import api from "@/lib/axios";

const wishlistRequests = new Map();

export const addWishlistService = async (productId) => {
  const response = await api.post(
    `/api/v1/customer/wishlist/${productId}`
  );

  return response.data;
};

export const getWishlistService = async (
  page = 1,
  page_size = 20
) => {
  const token = Cookies.get("token");

  if (!token) {
    return {
      success: true,
      data: [],
      pagination: { total_records: 0 },
    };
  }

  const requestKey = `${token}:${page}:${page_size}`;

  if (wishlistRequests.has(requestKey)) {
    return wishlistRequests.get(requestKey);
  }

  const request = api
    .get("/api/v1/customer/wishlist", {
      params: {
        page,
        page_size,
      },
    })
    .then((response) => response.data)
    .finally(() => {
      wishlistRequests.delete(requestKey);
    });

  wishlistRequests.set(requestKey, request);

  return request;
};

export const removeWishlistService = async (productId) => {
  const response = await api.delete(
    `/api/v1/customer/wishlist/${productId}`
  );

  return response.data;
};