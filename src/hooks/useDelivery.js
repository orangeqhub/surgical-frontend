import { useState } from "react";
import { checkServiceabilityService } from "@/services/deliveryservice";

export default function useShippingServiceability() {
  const [loading, setLoading] = useState(false);
  const [serviceability, setServiceability] = useState(null);
  const [error, setError] = useState(null);

  const checkServiceability = async (pincode) => {
    if (!pincode || String(pincode).trim().length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await checkServiceabilityService(pincode);
      
      // Safely unwrap response payload whether nested under data or top-level
      const payload = res?.data || res;
      setServiceability(payload);
      return payload;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to check serviceability. Please try again.";
      setError(message);
      setServiceability(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetServiceability = () => {
    setServiceability(null);
    setError(null);
    setLoading(false);
  };

  return {
    checkServiceability,
    serviceability,
    loading,
    error,
    resetServiceability,
  };
}