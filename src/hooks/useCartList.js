"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { getCartService } from "@/services/cart.service";

export default function useCartList() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    total_items: 0,
  });

  const user = useSelector((state) => state.user?.user);

  const fetchCart = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      if (!user?.id) {
        // =========================
        // GUEST CART FETCH
        // =========================
        const rawCart = JSON.parse(localStorage.getItem("guestCart")) || [];

        // 1. Filter out corrupt items
        const guestCart = rawCart.filter(
          (item) =>
            item?.product_id &&
            item.product_id !== "[object Object]" &&
            typeof item.product_id === "string"
        );

        // Update localStorage if corrupt items were purged
        if (guestCart.length !== rawCart.length) {
          localStorage.setItem("guestCart", JSON.stringify(guestCart));
        }

        // 2. Format items safely using top-level or nested fallback properties
        const formattedCart = guestCart.map((item) => {
          const product = item.product || {};
          const quantity = Number(item.quantity) || 1;
          const salePrice = Number(
            item.sale_price ?? product.sale_price ?? 0
          );
          const mrp = Number(item.mrp ?? product.mrp ?? 0);

          return {
            ...product, // Spread nested product details first
            ...item,    // Spread item details over it to preserve top-level overrides
            cart_id: item.cart_id || `guest_${Date.now()}_${item.product_id}`,
            product_id: item.product_id,
            quantity,
            name: item.name || product.name || "Unknown Product",
            sale_price: salePrice,
            mrp: mrp,
            thumbnail_url:
              item.thumbnail_url ||
              product.thumbnail_url ||
              product.images?.[0]?.image_url,
          };
        });

        // 3. Calculate summary metrics
        const total_items = formattedCart.reduce(
          (sum, item) => sum + (Number(item.quantity) || 1),
          0
        );

        const subtotal = formattedCart.reduce(
          (sum, item) => sum + (Number(item.sale_price) || 0) * (Number(item.quantity) || 1),
          0
        );

        setCart(formattedCart);
        setSummary({
          subtotal,
          total_items,
        });

        return;
      }

      // =========================
      // LOGGED IN CART FETCH
      // =========================
      const response = await getCartService();

      if (response?.success) {
        setCart([...(response.data || [])]);
        setSummary({
          subtotal: Number(response.cart_summary?.subtotal) || 0,
          total_items: Number(response.cart_summary?.total_items) || 0,
          ...response.cart_summary,
        });
      }
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  return {
    cart,
    summary,
    loading,
    fetchCart,
    setCart,
    setSummary,
  };
}