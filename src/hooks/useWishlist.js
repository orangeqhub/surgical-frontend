"use client";
 
import { useState, useCallback } from "react";
import Cookies from "js-cookie";
 
import {
  getWishlistService,
  addWishlistService,
  removeWishlistService,
} from "@/services/wishlist.service";
 
export default function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
 
  // ✅ Wrapped in useCallback to stop infinite loops in useEffects
  const fetchWishlist = useCallback(async () => {
    try {
      if (!Cookies.get("token")) {
        setWishlist([]);
        setPagination(null);
        setLoading(false);
        return;
      }

      setLoading(true);
 
      const response = await getWishlistService();
 
      if (response.success) {
        setWishlist(response.data || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.log("Fetch wishlist error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty array ensures the function reference never changes
 
  // ✅ ADD WISHLIST (store only objects safely)
  const addToWishlist = async (productId) => {
    if (!Cookies.get("token")) return;

    try {
      const res = await addWishlistService(productId);
 
      if (res.success) {
        setWishlist((prev) => {
          const exists = prev.some(
            (item) => item?.product_id === productId
          );
 
          if (exists) return prev;
 
          return [
            ...prev,
            res.data || { product_id: productId },
          ];
        });
 
        // Trigger global update
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (error) {
      console.log("Add wishlist error:", error);
    }
  };
 
  // ✅ REMOVE WISHLIST (SAFE)
  const removeFromWishlist = async (productId) => {
    if (!Cookies.get("token")) return;

    try {
      const res = await removeWishlistService(productId);
 
      if (res.success) {
        setWishlist((prev) =>
          prev.filter(
            (item) =>
              item && item.product_id !== productId
          )
        );
 
        // Trigger global update
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (error) {
      console.log("Remove wishlist error:", error);
    }
  };
 
  // ✅ SAFE CHECK (NO CRASH EVER)
  const isWishlisted = (productId) => {
    return wishlist?.some((item) => {
      return item?.product_id === productId;
    });
  };
 
  return {
    wishlist,
    loading,
    pagination,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  };
}
 