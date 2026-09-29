  import api from "@/lib/axios";
  import { API_ENDPOINTS } from "@/lib/endpoints";
  
  export const trackOrderService = async (orderId) => {
  const response = await api.get(
    API_ENDPOINTS.TRACK_ORDER(orderId)
  );

  return response.data;
};