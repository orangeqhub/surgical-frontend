import { API_ENDPOINTS } from "@/lib/endpoints";
import api from "@/lib/axios";
import axios from "axios";

const FALLBACK_CATALOG_URL = "https://api.surgicalworld.org";

export const getBannersService = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_BANNER);
    if (response?.data && (Array.isArray(response.data) ? response.data.length > 0 : true)) {
      return response.data;
    }
    const fallbackResp = await axios.get(`${FALLBACK_CATALOG_URL}/api/v1/banners`);
    if (fallbackResp.status === 200) {
      return fallbackResp.data;
    }
    return response.data;
  } catch (err) {
    try {
      const fallbackResp = await axios.get(`${FALLBACK_CATALOG_URL}/api/v1/banners`);
      if (fallbackResp.status === 200) {
        return fallbackResp.data;
      }
    } catch (fallbackErr) {
      // preserve original error
    }
    throw err;
  }
};