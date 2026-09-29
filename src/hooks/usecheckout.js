// "use client";
 
// import { useEffect, useState } from "react";
// import { getCartService } from "@/services/cart.service";
// import {
//   createOrderService,
//   getCartSummaryService,
//   // 🌟 Make sure to create and export these two functions inside your @/services/payment file
//   createRazorpayPaymentService,
//   verifyRazorpayPaymentService,
// } from "@/services/payment";
// import { getAddressesService } from "@/services/address.service";
 
// export default function useCheckout() {
//   const [cartItems, setCartItems] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
 
//   const [loading, setLoading] = useState(false);
//   const [orderLoading, setOrderLoading] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);
 
//   const [popupSummary, setPopupSummary] = useState(null);
//   const [couponCode, setCouponCode] = useState("");
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
 
//   useEffect(() => {
//     const saved = localStorage.getItem("selected_address");
//     if (saved) {
//       try { setSelectedAddress(JSON.parse(saved)); } catch (e) { console.error("Invalid address"); }
//     }
//   }, []);
 
//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const res = await getCartService();
//       setCartItems(res?.data || []);
//     } catch (err) { console.error(err); } finally { setLoading(false); }
//   };
 
//   const fetchAddresses = async () => {
//     try {
//       const res = await getAddressesService();
//       setAddresses(res?.data || []);
//     } catch (err) { console.error(err); }
//   };
 
//   useEffect(() => {
//     fetchCart();
//     fetchAddresses();
//   }, []);
 
//   const getCartSummary = async () => {
//     try {
//       const res = await getCartSummaryService();
//       const summary = res?.data?.data || res?.data;
//       setPopupSummary(summary);
//       return res;
//     } catch (err) {
//       console.error("Summary error:", err);
//       return null;
//     }
//   };
 
// const placeOrder = async () => {
//     const addressId = selectedAddress?.id;
   
//     if (!addressId) {
//       alert("Please select address");
//       return null;
//     }
 
//     try {
//       setOrderLoading(true);
     
//       const payload = {
//         address_id: addressId,
//         // 🌟 FIX: Use an accepted enum value like "upi", "card", or "net_banking"
//         payment_method: "upi",
//         coupon_code: couponCode ? couponCode : null,
//       };
 
//       const res = await createOrderService(payload);
//       return res?.data?.data || res?.data;
     
//     } catch (err) {
//       console.error("Order API Validation Error:", err?.response?.data || err.message);
//       return null;
//     } finally {
//       setOrderLoading(false);
//     }
//   };
 
//   // 🌟 NEW: Initialize the Razorpay Payment Intent on Backend
//   const initializeRazorpayPayment = async (orderId) => {
//     try {
//       setPaymentLoading(true);
//       const res = await createRazorpayPaymentService({ order_id: orderId });
//       return res?.data?.data || res?.data || res;
//     } catch (err) {
//       console.error("Error creating gateway session:", err);
//       throw err;
//     } finally {
//       setPaymentLoading(false);
//     }
//   };
 
//   // 🌟 NEW: Cryptographic Verification Endpoint Call
// const verifyPaymentSignature = async (payload) => {
//   try {
//     setPaymentLoading(true);
//     const res = await verifyRazorpayPaymentService(payload);
//     fetchCart();

//     // Handle both raw-axios and pre-unwrapped service responses
//     const body = res?.data?.success !== undefined ? res.data : res;
//     return body;
//   } catch (err) {
//     console.error("Verification error:", err);
//     throw err;
//   } finally {
//     setPaymentLoading(false);
//   }
// };
 
//   return {
//     cartItems,
//     addresses,
//     selectedAddress,
//     setSelectedAddress,
//     loading,
//     orderLoading,
//     paymentLoading,
//     popupSummary,
//     couponCode,
//     setCouponCode,
//     showPaymentModal,
//     setShowPaymentModal,
//     fetchCart,
//     fetchAddresses,
//     getCartSummary,
//     placeOrder,
//     initializeRazorpayPayment,
//     verifyPaymentSignature,
//   };
// }
 















"use client";

import { useEffect, useState } from "react";
import { getCartService } from "@/services/cart.service";
import {
  createOrderService,
  getCartSummaryService,
  createRazorpayPaymentService,
  verifyRazorpayPaymentService,
} from "@/services/payment";
import { getAddressesService } from "@/services/address.service";

export default function useCheckout() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [popupSummary, setPopupSummary] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("selected_address");
    if (saved) {
      try { setSelectedAddress(JSON.parse(saved)); } catch (e) { console.error("Invalid address"); }
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCartService();
      setCartItems(res?.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchAddresses = async () => {
    try {
      const res = await getAddressesService();
      setAddresses(res?.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const getCartSummary = async () => {
    try {
      const res = await getCartSummaryService();
      const summary = res?.data?.data || res?.data;
      setPopupSummary(summary);
      return res;
    } catch (err) {
      console.error("Summary error:", err);
      return null;
    }
  };

  const placeOrder = async () => {
    const addressId = selectedAddress?.id;

    if (!addressId) {
      alert("Please select address");
      return null;
    }

    try {
      setOrderLoading(true);

      const payload = {
        address_id: addressId,
        payment_method: "upi",
        coupon_code: couponCode ? couponCode : null,
      };

      const res = await createOrderService(payload);
      return res?.data?.data || res?.data;

    } catch (err) {
      console.error("Order API Validation Error:", err?.response?.data || err.message);
      return null;
    } finally {
      setOrderLoading(false);
    }
  };

  const initializeRazorpayPayment = async (orderId) => {
    try {
      setPaymentLoading(true);
      const res = await createRazorpayPaymentService({ order_id: orderId });
      return res?.data?.data || res?.data || res;
    } catch (err) {
      console.error("Error creating gateway session:", err);
      throw err;
    } finally {
      setPaymentLoading(false);
    }
  };

  // ==========================================
  // VERIFY RAZORPAY PAYMENT
  // Handles both raw-axios responses and
  // pre-unwrapped service responses, so
  // `success` / `message` are always found
  // at the right level.
  // ==========================================
  const verifyPaymentSignature = async (payload) => {
    try {
      setPaymentLoading(true);
      const res = await verifyRazorpayPaymentService(payload);

      fetchCart(); // refresh cart on success

      // Case A: res = raw axios response -> real body is res.data
      // Case B: res = already-unwrapped body -> real body is res itself
      const body =
        res?.data?.success !== undefined
          ? res.data
          : res?.success !== undefined
            ? res
            : res?.data || res;

      return body;

    } catch (err) {
      console.error("Verification error:", err);
      throw err;
    } finally {
      setPaymentLoading(false);
    }
  };

  return {
    cartItems,
    addresses,
    selectedAddress,
    setSelectedAddress,
    loading,
    orderLoading,
    paymentLoading,
    popupSummary,
    couponCode,
    setCouponCode,
    showPaymentModal,
    setShowPaymentModal,
    fetchCart,
    fetchAddresses,
    getCartSummary,
    placeOrder,
    initializeRazorpayPayment,
    verifyPaymentSignature,
  };
}