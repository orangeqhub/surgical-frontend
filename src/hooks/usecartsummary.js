"use client";
 
import { useEffect, useState } from "react";
 
import {
  getCartSummaryService,
  applyCouponService,
} from "@/services/payment";
 
export default function useCartSummary() {
  const [summary, setSummary] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
 
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState("");
 
  // =========================
  // FETCH SUMMARY (WITHOUT COUPON)
  // =========================
  const fetchSummary = async (params) => {
    try {
      setLoading(true);
 
      const response = await getCartSummaryService(params);
 
      if (response?.success) {
        const data = response.data;
 
        setSummary(data);
        setCoupons(data?.available_coupons || []);
        setSelectedCoupon(null);
      }
    } catch (err) {
      console.log(err);
 
      setError(
        err?.response?.data?.message ||
          "Failed to load summary"
      );
    } finally {
      setLoading(false);
    }
  };
 
  // =========================
  // APPLY COUPON
  // =========================
  const applyCoupon = async (couponCode) => {
    try {
      setCouponLoading(true);
 
      if (!couponCode?.trim()) {
        return {
          success: false,
          message: "Invalid coupon code",
        };
      }
 
      const response = await applyCouponService(couponCode);
 
      console.log("COUPON RESPONSE:", response);
 
      if (response?.success) {
        const data = response.data;
 
        // store applied coupon
        setSelectedCoupon(data);
 
        // IMPORTANT: update only pricing fields
        setSummary((prev) => {
          if (!prev) return prev;
 
          return {
            ...prev,
            discount_amount: data.discount_amount,
            total_amount: data.payable_amount,
          };
        });
 
        return {
          success: true,
          data,
        };
      }
 
      return {
        success: false,
        message: response?.message || "Coupon not applied",
      };
    } catch (err) {
      console.log(err);
 
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          "Coupon apply failed",
      };
    } finally {
      setCouponLoading(false);
    }
  };
 
  // =========================
  // REMOVE COUPON
  // =========================
  const removeCoupon = async () => {
    try {
      setSelectedCoupon(null);
      await fetchSummary(); // reset original cart
    } catch (err) {
      console.log(err);
    }
  };
 
  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchSummary();
  }, []);
 
  return {
    summary,
    coupons,
    selectedCoupon,
    loading,
    couponLoading,
    error,
    fetchSummary,
    applyCoupon,
    removeCoupon,
  };
}