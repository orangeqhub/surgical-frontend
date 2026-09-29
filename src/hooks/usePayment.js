// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   getCartService,
// } from "@/services/cart.service";

// import {
//   paymentSuccessService,
// } from "@/services/payment";

// import {
//   createAddressService,
//   getAddressesService,
//   getAddressServicebyid,
// } from "@/services/address.service";

// export default function usePayment() {

//   // =========================
//   // STATES
//   // =========================
//   const [cartItems, setCartItems] =
//     useState([]);

//   const [summary, setSummary] =
//     useState({});

//   const [addresses, setAddresses] =
//     useState([]);

//   const [selectedAddress, setSelectedAddress] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(false);

//   const [paymentLoading, setPaymentLoading] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [success, setSuccess] =
//     useState(false);

//   const [paymentResponse, setPaymentResponse] =
//     useState(null);

//   const [addressResponse, setAddressResponse] =
//     useState(null);

//   // =========================
//   // GET CART
//   // =========================
//   const fetchCart =
//     async () => {

//       try {

//         setLoading(true);

//         setError("");

//         const response =
//           await getCartService();

//         console.log(
//           "CART RESPONSE:",
//           response
//         );

//         setCartItems(
//           response?.data || []
//         );

//         setSummary(
//           response?.cart_summary ||
//           {}
//         );

//       } catch (err) {

//         console.log(err);

//         setError(
//           err?.response?.data
//             ?.message ||
//           "Failed to fetch cart"
//         );

//       } finally {

//         setLoading(false);
//       }
//     };

//   // =========================
//   // GET ALL ADDRESSES
//   // =========================
//   const fetchAddresses =
//     async () => {

//       try {

//         setLoading(true);

//         const response =
//           await getAddressesService();

//         console.log(
//           "ADDRESSES RESPONSE:",
//           response
//         );

//         const addressData =
//           response?.data || [];

//         setAddresses(
//           addressData
//         );

//         // AUTO SELECT FIRST ADDRESS
//         if (
//           addressData.length > 0
//         ) {

//           setSelectedAddress(
//             addressData[0]
//           );
//         }

//       } catch (err) {

//         console.log(err);

//       } finally {

//         setLoading(false);
//       }
//     };

//   // =========================
//   // GET ADDRESS BY ID
//   // =========================
//   const fetchAddressById =
//     async (addressId) => {

//       try {

//         setLoading(true);

//         const response =
//           await getAddressServicebyid(
//             addressId
//           );

//         console.log(
//           "ADDRESS BY ID:",
//           response
//         );

//         setSelectedAddress(
//           response?.data || response
//         );

//         return response;

//       } catch (err) {

//         console.log(err);

//         return null;

//       } finally {

//         setLoading(false);
//       }
//     };

//   // =========================
//   // CREATE ADDRESS
//   // =========================
//   const handleCreateAddress =
//     async (addressData) => {

//       try {

//         setLoading(true);

//         setError("");

//         const response =
//           await createAddressService(
//             addressData
//           );

//         console.log(
//           "ADDRESS RESPONSE:",
//           response
//         );

//         setAddressResponse(
//           response
//         );

//         await fetchAddresses();

//         return {
//           success: true,
//           data: response,
//         };

//       } catch (err) {

//         console.log(err);

//         const message =
//           err?.response?.data
//             ?.message ||
//           "Failed to create address";

//         setError(message);

//         return {
//           success: false,
//           message,
//         };

//       } finally {

//         setLoading(false);
//       }
//     };

//   // =========================
//   // PAYMENT SUCCESS
//   // =========================
//   const handlePaymentSuccess =
//     async ({
//       address_id,
//       transaction_id,
//     }) => {

//       try {

//         setPaymentLoading(true);

//         setError("");

//         setSuccess(false);

//         // =========================
//         // VALIDATION
//         // =========================
//         if (!address_id) {

//           setError(
//             "Please select address"
//           );

//           return {
//             success: false,
//           };
//         }

//         // =========================
//         // PAYLOAD
//         // =========================
//         const payload = {

//           address_id,

//           transaction_id,
//         };

//         console.log(
//           "PAYMENT PAYLOAD:",
//           payload
//         );

//         // =========================
//         // API CALL
//         // =========================
//         const response =
//           await paymentSuccessService(
//             payload
//           );

//         console.log(
//           "PAYMENT RESPONSE:",
//           response
//         );

//         setPaymentResponse(
//           response
//         );

//         setSuccess(true);

//         return {
//           success: true,
//           data: response,
//         };

//       } catch (err) {

//         console.log(err);

//         const message =

//           err?.response?.data
//             ?.message ||

//           err?.response?.data
//             ?.detail?.[0]?.msg ||

//           "Payment failed";

//         setError(message);

//         return {
//           success: false,
//           message,
//         };

//       } finally {

//         setPaymentLoading(false);
//       }
//     };

//   // =========================
//   // INITIAL LOAD
//   // =========================
//   useEffect(() => {

//     fetchCart();

//     fetchAddresses();

//   }, []);

//   return {

//     // =========================
//     // CART
//     // =========================
//     cartItems,
//     summary,
//     loading,
//     fetchCart,

//     // =========================
//     // ADDRESS
//     // =========================
//     addresses,
//     selectedAddress,
//     setSelectedAddress,

//     fetchAddresses,
//     fetchAddressById,

//     handleCreateAddress,
//     addressResponse,

//     // =========================
//     // PAYMENT
//     // =========================
//     paymentLoading,
//     handlePaymentSuccess,
//     paymentResponse,

//     // =========================
//     // COMMON
//     // =========================
//     error,
//     success,
//   };
// }







"use client";

import { useEffect, useState } from "react";

import { getCartService } from "@/services/cart.service";
import { paymentSuccessService } from "@/services/payment";
import {
  getAddressesService,
} from "@/services/address.service";

export default function usePayment() {

  // =========================
  // STATES
  // =========================
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCartService();

      console.log("CART RESPONSE:", response);

      if (response?.success) {
        const data = response.data;

        // ✅ FIX: correct API structure
        setCartItems(data?.data || []);

        // ✅ IMPORTANT: summary comes from cart_summary
        setSummary(data?.cart_summary || null);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH ADDRESSES
  // =========================
  const fetchAddresses = async () => {
    try {
      const response = await getAddressesService();

      const list = response?.data || [];

      setAddresses(list);

      // auto select first address
      if (list.length > 0) {
        setSelectedAddress(list[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // PAYMENT
  // =========================
  const handlePaymentSuccess = async (payload) => {
    try {
      setPaymentLoading(true);
      setError("");
      setSuccess(false);

      const response = await paymentSuccessService(payload);

      console.log("PAYMENT RESPONSE:", response);

      if (response?.success) {
        setSuccess(true);
        return response.data;
      }

      throw new Error("Payment failed");
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
        "Payment failed"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  return {
    cartItems,
    summary,

    addresses,
    selectedAddress,
    setSelectedAddress,

    loading,
    paymentLoading,
    error,
    success,

    handlePaymentSuccess,
  };
}