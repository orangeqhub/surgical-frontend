"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";

export default function useCategories() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response =
        await categoryService.getCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error(error);

      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}