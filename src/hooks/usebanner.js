"use client";

import { useState, useEffect, useCallback } from "react";
import { getBannersService } from "@/services/bannerservice";

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBannersService();
      const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order);
      setBanners(sorted);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, refetch: fetchBanners };
};