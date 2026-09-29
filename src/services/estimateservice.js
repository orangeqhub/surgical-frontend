// src/services/shipping.service.js
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/endpoints";

/**
 * Fetch delivery estimation for a destination pincode
 * @param {string} pincode - 6-digit customer destination pincode
 * @param {boolean} isCod - true for Cash on Delivery, false for prepaid
 */
export const checkDeliveryEstimateService = async (pincode, isCod = false) => {
  try {
    const response = await api.get(API_ENDPOINTS.ESTIMATE_DELIVERY, {
      params: {
        pincode: String(pincode).trim(),
        is_cod: Boolean(isCod),
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Estimate Delivery Service Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};