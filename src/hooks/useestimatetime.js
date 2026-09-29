"use client";

import { useState } from "react";
import { checkDeliveryEstimateService } from "@/services/estimateservice";

export default function useDeliveryEstimate() {
  const [loading, setLoading] = useState(false);
  const [estimateData, setEstimateData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Check estimate delivery date for a pincode
   */
  const checkEstimate = async (pincode, isCod = false) => {
    // Basic 6-digit Pincode Validation
    const cleanPincode = String(pincode || "").trim();
    if (!cleanPincode || cleanPincode.length !== 6 || isNaN(Number(cleanPincode))) {
      setError("Please enter a valid 6-digit pincode.");
      setEstimateData(null);
      return { success: false, message: "Invalid pincode length" };
    }

    try {
      setLoading(true);
      setError(null);

      const data = await checkDeliveryEstimateService(cleanPincode, isCod);

      setEstimateData(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to fetch delivery estimate for this pincode.";

      setError(errorMessage);
      setEstimateData(null);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear state
   */
  const clearEstimate = () => {
    setEstimateData(null);
    setError(null);
  };

  return {
    loading,
    estimateData,
    error,
    checkEstimate,
    clearEstimate,
    // Helper boolean shortcut for quick UI rendering
    isServiceable: Boolean(estimateData?.is_serviceable),
  };
}