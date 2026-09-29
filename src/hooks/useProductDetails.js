import { useState } from "react";
import { getProductDetails } from "@/services/product.service";

export default function useProductDetails() {
  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchProduct =
    async (id) => {
      try {
        setLoading(true);

        const response =
          await getProductDetails(
            id
          );

        setProduct(
          response.data
        );
      } finally {
        setLoading(false);
      }
    };

  return {
    product,
    loading,
    fetchProduct,
  };
}