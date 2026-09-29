import { API_ENDPOINTS } from "@/lib/endpoints";
import api from "@/lib/axios";

export const checkServiceabilityService = async (pincode) => {
  const response = await api.get(API_ENDPOINTS.CHECK_SERVICEABILITY, {
    params: { pincode },
  });

  return response.data;
};