import { API_ENDPOINTS } from "@/lib/endpoints";
import api from "@/lib/axios";



export const getOrdersService =
  async () => {
    const response = await api.get(
      API_ENDPOINTS.GET_ORDERS
    );

    return response.data;
  };


export const getOrderByIdService =
  async (orderId) => {
    const response = await api.get(
      API_ENDPOINTS.GET_ORDERBYID.replace(
        "{order_id}",
        orderId
      )
    );

    return response.data;
  };


export const createReviewService =
  async (reviewData) => {
    const response = await api.post(
      API_ENDPOINTS.CREATE_REVIEW,
      reviewData
    );

    return response.data;
  };