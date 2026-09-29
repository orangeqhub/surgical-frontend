"use client";
 
import {
  useState,
  useEffect,
  useCallback,
} from "react";
 
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
 
import { getCartService } from "@/services/cart.service";
 
export default function useCartCount() {
  const [cartCount, setCartCount] = useState(0);
 
  const user = useSelector((state) => state.user?.user);
  const userId = user?.id;
 
  const fetchCartCount = useCallback(async () => {
    try {
      const token =
        Cookies.get("token") ||
        (typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("access_token")
          : null);

      if (!userId || !token) {
        // =========================
        // GUEST CART COUNT
        // =========================
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const totalCount = guestCart.reduce((total, item) => total + item.quantity, 0);
       
        await Promise.resolve();
        setCartCount(totalCount);
        return;
      }
 
      // =========================
      // LOGGED IN CART COUNT
      // =========================
      const response = await getCartService();
 
      if (response?.success) {
        setCartCount(
          response?.cart_summary?.total_items || 0
        );
      }
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return;
      }
      console.error("Cart Count Error:", error);
    }
  }, [userId]);
 
  useEffect(() => {
    let ignore = false;

    const run = async () => {
      if (!ignore) {
        await fetchCartCount();
      }
    };

    run();

    return () => {
      ignore = true;
    };
  }, [fetchCartCount]);
 
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };
 
    window.addEventListener("cartUpdated", handleCartUpdate);
 
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [fetchCartCount]);
 
  return {
    cartCount,
    fetchCartCount,
  };
}
 