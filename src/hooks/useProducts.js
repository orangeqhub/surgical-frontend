
import { useState } from "react";
import { getProducts } from "@/services/product.service";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts(params);

      setProducts(response.data);
      setPagination(response.pagination);

      return response;
    } catch (err) {
      setError(
        err?.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
  };
}