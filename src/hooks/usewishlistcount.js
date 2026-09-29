"use client";
 
import {
  useState,
  useEffect,
  useCallback,
} from "react";
 
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
 
import { getWishlistService } from "@/services/wishlist.service";
 
export default function useWishlistCount() {
  const [wishlistCount, setWishlistCount] =
    useState(0);
 
  const user = useSelector(
    (state) => state.user.user
  );
 
  const fetchWishlistCount =
    useCallback(async () => {
      try {
        if (!user?.id || !Cookies.get("token")) {
          setWishlistCount(0);
          return;
        }
 
        const response =
          await getWishlistService();
 
        if (response?.success) {
          setWishlistCount(
            response?.pagination
              ?.total_records || 0
          );
        }
      } catch (error) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setWishlistCount(0);
          return;
        }

        console.error(
          "Wishlist Count Error:",
          error
        );
      }
    }, [user?.id]);
 
  useEffect(() => {
    fetchWishlistCount();
  }, [fetchWishlistCount]);
 
  useEffect(() => {
    const handleWishlistUpdate =
      () => {
        fetchWishlistCount();
      };
 
    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );
 
    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, [fetchWishlistCount]);
 
  return {
    wishlistCount,
    fetchWishlistCount,
  };
}