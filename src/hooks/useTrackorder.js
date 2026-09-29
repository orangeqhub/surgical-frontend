import { useState, useEffect } from "react";
import { trackOrderService } from "@/services/trackorderservice";

export const useTrackOrder = (orderId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchTracking = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await trackOrderService(orderId);
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || "Failed to fetch tracking info");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error tracking order");
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [orderId]);

  return { data, loading, error };
};