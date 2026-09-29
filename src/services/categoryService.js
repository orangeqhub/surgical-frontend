import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/endpoints";
import axios from "axios";

const FALLBACK_CATALOG_URL = "https://api.surgicalworld.org";

export const categoryService = {
  getCategories: async () => {
    try {
      const response = await api.get(
        API_ENDPOINTS.CATEGORIES
      );

      if (response?.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data;
      }

      const fallbackResp = await axios.get(`${FALLBACK_CATALOG_URL}/api/v1/store/categories`);
      if (fallbackResp.status === 200 && fallbackResp.data?.data?.length > 0) {
        return fallbackResp.data;
      }

      return response.data;
    } catch (err) {
      try {
        const fallbackResp = await axios.get(`${FALLBACK_CATALOG_URL}/api/v1/store/categories`);
        if (fallbackResp.status === 200) {
          return fallbackResp.data;
        }
      } catch (fallbackErr) {
        // preserve original error
      }
      throw err;
    }
  },
};