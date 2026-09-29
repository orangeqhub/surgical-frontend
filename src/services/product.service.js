import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/endpoints";
import axios from "axios";

const FALLBACK_CATALOG_URL = "https://api.surgicalworld.org";

export const getProducts = async ({
  page = 1,
  page_size = 20,
  search = "",
  category_id = "",
}) => {
  const params = {
    page,
    page_size,
    search: search || undefined,
    category_id: category_id || undefined,
  };

  try {
    const response = await api.get(
      API_ENDPOINTS.PRODUCTS,
      { params }
    );

    if (response?.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data;
    }

    const fallbackResp = await axios.get(`${FALLBACK_CATALOG_URL}/api/v1/store/products`, { params });
    if (fallbackResp.status === 200 && fallbackResp.data?.data?.length > 0) {
      return fallbackResp.data;
    }

    return response.data;
  } catch (err) {
    try {
      const fallbackResp = await axios.get(`${FALLBACK_CATALOG_URL}/api/v1/store/products`, { params });
      if (fallbackResp.status === 200) {
        return fallbackResp.data;
      }
    } catch (fallbackErr) {
      // preserve original error
    }
    throw err;
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.PRODUCT_DETAILS(id)
    );

    return response.data;
  } catch (err) {
    try {
      const fallbackResp = await axios.get(`${FALLBACK_CATALOG_URL}/api/v1/store/products/${id}`);
      if (fallbackResp.status === 200) {
        return fallbackResp.data;
      }
    } catch (fallbackErr) {
      // preserve original error
    }
    throw err;
  }
};