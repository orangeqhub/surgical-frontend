"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getOrderByIdService,
  getOrdersService,
  createReviewService,
} from "@/services/review.service";

export default function useOrders() {
  // ==============================
  // STATES
  // ==============================
  const [orders, setOrders] =
    useState([]);

  const [singleOrder, setSingleOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [reviewError, setReviewError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [reviewSuccess, setReviewSuccess] =
    useState("");

  // ==============================
  // GET ALL ORDERS
  // ==============================
  const fetchOrders =
    async () => {
      try {
        setLoading(true);

        setError("");

        const response =
          await getOrdersService();

        console.log(
          "ORDERS RESPONSE =>",
          response
        );

        if (response?.success) {
          setOrders(
            response?.data || []
          );
        }
      } catch (err) {
        console.log(err);

        setError(
          err?.response?.data
            ?.message ||
            "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

  // ==============================
  // GET ORDER BY ID
  // ==============================
  const fetchOrderById =
    async (orderId) => {
      try {
        setLoading(true);

        setError("");

        const response =
          await getOrderByIdService(
            orderId
          );

        console.log(
          "ORDER DETAILS =>",
          response
        );

        if (response?.success) {
          setSingleOrder(
            response?.data
          );

          return response?.data;
        }

        return null;
      } catch (err) {
        console.log(err);

        setError(
          err?.response?.data
            ?.message ||
            "Failed to fetch order"
        );

        return null;
      } finally {
        setLoading(false);
      }
    };

  // ==============================
  // CREATE REVIEW
  // ==============================
  const createReview =
    async (reviewData) => {
      try {
        setReviewLoading(true);

        setReviewError("");

        setReviewSuccess("");

        const response =
          await createReviewService(
            reviewData
          );

        console.log(
          "REVIEW RESPONSE =>",
          response
        );

        if (response?.success) {
          setReviewSuccess(
            response?.message ||
              "Review submitted successfully"
          );

          return response;
        }

        return false;
      } catch (err) {
        console.log(err);

        setReviewError(
          err?.response?.data
            ?.message ||
            "Failed to submit review"
        );

        return false;
      } finally {
        setReviewLoading(false);
      }
    };

  // ==============================
  // INITIAL FETCH
  // ==============================
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    // states
    orders,
    singleOrder,

    loading,
    reviewLoading,

    error,
    reviewError,

    success,
    reviewSuccess,

    // methods
    fetchOrders,
    fetchOrderById,
    createReview,
  };
}







