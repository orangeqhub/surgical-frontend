"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar,
  PackageCheck,
  ShieldCheck,
  ChevronRight,
  Clock,
  Zap,
  Sparkles
} from "lucide-react";

import PaymentSummary from "./ordersummery";
import PaymentSuccessModal from "./paymentsuscessmodel";

import useCheckout from "@/hooks/usecheckout";
import useCartSummary from "@/hooks/usecartsummary";
import useDeliveryEstimate from "@/hooks/useestimatetime";

export default function PaymentPageContent() {
  const router = useRouter();

  // ==========================================
  // HOOKS
  // ==========================================
  const {
    cartItems,
    loading,
    orderLoading,
    paymentLoading,
    selectedAddress,
    placeOrder,
    initializeRazorpayPayment,
    verifyPaymentSignature,
    setCouponCode,
  } = useCheckout();

  const cartSummaryHooks = useCartSummary();
  const { summary, selectedCoupon } = cartSummaryHooks;

  const {
    loading: estimateLoading,
    estimateData,
    checkEstimate,
  } = useDeliveryEstimate();

  // ==========================================
  // STATE
  // ==========================================
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState({
    show: false,
    message: "",
  });

  // Helper function to format date from 18-AUG-26 -> Tue, 18 Aug 2026
  const formatDeliveryDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = `20${parts[2]}`;
        const parsedDate = new Date(`${day} ${month} ${year}`);
        if (!isNaN(parsedDate)) {
          return parsedDate.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Automatically check shipping estimate and update GST cart summary when selectedAddress changes
  useEffect(() => {
    if (selectedAddress?.pincode) {
      checkEstimate(selectedAddress.pincode, false);
    }
    if (selectedAddress?.id || selectedAddress?.state) {
      cartSummaryHooks.fetchSummary({
        address_id: selectedAddress?.id,
        state: selectedAddress?.state,
      });
    }
  }, [selectedAddress?.id, selectedAddress?.state, selectedAddress?.pincode]);

  // Sync coupon code to checkout state
  useEffect(() => {
    if (selectedCoupon?.coupon_code) {
      setCouponCode(selectedCoupon.coupon_code);
    } else {
      setCouponCode(null);
    }
  }, [selectedCoupon, setCouponCode]);

  // Handle Place Order Trigger
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address first.");
      return;
    }
    setShowModal(true);
  };

  // Payment Handler
  const handlePayNow = async () => {
    try {
      const order = await placeOrder();

      if (!order?.order_id) {
        throw new Error("Order creation failed");
      }

      const razorpayConfig = await initializeRazorpayPayment(order.order_id);

      if (!razorpayConfig?.razorpay_order_id) {
        throw new Error("Failed to initialize payment gateway");
      }

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayConfig.amount,
        currency: razorpayConfig.currency || "INR",
        name: "SURGICAL WORLD",
        description: `Order #${order.order_id.slice(0, 8)}`,
        order_id: razorpayConfig.razorpay_order_id,

        handler: async function (response) {
          try {
            const verificationPayload = {
              order_id: order.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verificationResult = await verifyPaymentSignature(verificationPayload);

            if (verificationResult?.success) {
              setShowModal(false);
              setSuccessModal({
                show: true,
                message: verificationResult?.message || "Payment completed successfully!",
              });
            } else {
              alert(verificationResult?.message || "Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Verification processing failed");
          }
        },

        prefill: {
          name: selectedAddress?.full_name || "Valued Customer",
          contact: selectedAddress?.phone || "",
        },

        theme: { color: "#007595" },

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        upi: { flow: isMobile ? "intent" : "collect" },

        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout window closed.");
          },
        },

        retry: { enabled: true, max_count: 2 },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("PAYMENT FAILED:", response);
          alert(response?.error?.description || "Payment failed");
        });
        rzp.open();
      } else {
        alert("Razorpay payment system unavailable");
      }
    } catch (err) {
      console.error(err);
      alert(err?.message || "Payment initialization failed");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* ==========================================
          LEFT SECTION: CART ITEMS & SHIPPING
      ========================================== */}
      <div className="space-y-6 lg:col-span-2">
        
        {/* Selected Address Card */}
        {/* {selectedAddress && (
          <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 via-white to-blue-50/50 p-4 sm:p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3.5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                      Delivering To
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Pincode: <span className="text-gray-900 font-bold">{selectedAddress.pincode}</span>
                    </span>
                  </div>
                  <h4 className="mt-1 font-bold text-gray-900 text-base">
                    {selectedAddress.full_name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-1">
                    {selectedAddress.address_line_1}, {selectedAddress.city}, {selectedAddress.state}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition cursor-pointer shadow-2xs"
              >
                Change Address
              </button>
            </div>
          </div>
        )} */}

        {/* Order Items List Box */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[var(--color-text-primary)]">
                <PackageCheck size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Order Items ({cartItems?.length || 0})
              </h2>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <ShieldCheck size={14} />
              In Stock & Ready
            </span>
          </div>

          {loading ? (
            <div className="space-y-4 py-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(cartItems || []).map((item) => (
                <div
                  key={item.cart_id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center justify-between group transition-all"
                >
                  {/* Product Details */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50">
                      <img
                        src={item.thumbnail_url || "/images/product-placeholder.png"}
                        alt={item.name}
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                        {item.name}
                      </h3>
                      
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          Qty: <span className="font-semibold text-gray-800">{item.quantity}</span>
                        </span>
                        {item.variant_size && (
                          <span>
                            Size: <span className="font-semibold text-gray-800">{item.variant_size}</span>
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 font-extrabold text-emerald-600 text-base">
                        ₹{Number(item.sale_price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Estimation Box */}
                  <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs sm:min-w-[240px] sm:items-end">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Truck size={14} className="text-blue-600" />
                      <span>Estimated Delivery</span>
                    </div>

                    {estimateLoading ? (
                      <div className="mt-2 flex items-center gap-1.5 text-slate-400">
                        <Clock size={13} className="animate-spin text-blue-500" />
                        <span>Fetching shipping schedule...</span>
                      </div>
                    ) : estimateData ? (
                      <div className="mt-1.5 text-left sm:text-right">
                        {estimateData.is_serviceable ? (
                          <>
                            <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs sm:text-sm">
                              <CheckCircle2 size={15} className="text-emerald-600" />
                              <span>
                                {formatDeliveryDate(estimateData.expected_delivery_date) || estimateData.expected_delivery_date}
                              </span>
                            </div>

                            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 justify-start sm:justify-end">
                              <span className="inline-flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                                <Zap size={10} /> Express
                              </span>
                              <span>Pincode {estimateData.destination_pincode}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-700 font-semibold">
                            <AlertCircle size={14} className="text-amber-500" />
                            <span>Delivery Not Available</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-400">
                        {selectedAddress?.pincode
                          ? `Pincode: ${selectedAddress.pincode}`
                          : "Select address to view date"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={orderLoading || !cartItems?.length}
          className="
            flex w-full items-center justify-center gap-2 rounded-2xl 
            bg-[var(--color-text-primary)] py-4 text-base font-bold text-white 
            shadow-md transition-all duration-200 hover:opacity-95 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer
          "
        >
          {orderLoading ? (
            <span>Preparing Order...</span>
          ) : (
            <>
              <span>Proceed to Payment</span>
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* ==========================================
          RIGHT SECTION: SUMMARY & PAYMENTS
      ========================================== */}
      <div>
        <PaymentSummary cartSummaryHooks={cartSummaryHooks} selectedAddress={selectedAddress} />
      </div>

      {/* ==========================================
          FINAL SUMMARY MODAL
      ========================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl transition-all border border-gray-100">
            <div className="flex items-center justify-center gap-2 text-center mb-4">
              <Sparkles className="text-amber-500" size={20} />
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Order Details
              </h2>
            </div>

            <div className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Items Total:</span>
                <span className="font-semibold text-gray-900">{summary?.total_items || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  ₹{Number(summary?.subtotal || 0).toLocaleString("en-IN")}
                </span>
              </div>

              {summary?.is_andhra_pradesh ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CGST (9%):</span>
                    <span className="font-semibold text-gray-900">
                      ₹{Number(summary?.cgst_amount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">SGST (9%):</span>
                    <span className="font-semibold text-gray-900">
                      ₹{Number(summary?.sgst_amount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-500">IGST (18%):</span>
                  <span className="font-semibold text-gray-900">
                    ₹{Number(summary?.igst_amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Fee:</span>
                <span className="font-semibold text-emerald-600">
                  {summary?.shipping_charge === 0 ? "FREE" : `₹${summary?.shipping_charge || 0}`}
                </span>
              </div>

              {estimateData?.expected_delivery_date && (
                <div className="flex items-center justify-between rounded-lg bg-blue-50 border border-blue-100 p-2.5 text-xs text-blue-900">
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar size={13} className="text-blue-600" />
                    Expected Delivery:
                  </span>
                  <span className="font-bold">
                    {formatDeliveryDate(estimateData.expected_delivery_date) || estimateData.expected_delivery_date}
                  </span>
                </div>
              )}

              {selectedCoupon && (
                <div className="flex justify-between rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-xs font-semibold text-emerald-800">
                  <span>Coupon ({selectedCoupon.coupon_code}):</span>
                  <span>-₹{summary?.discount_amount || 0}</span>
                </div>
              )}
            </div>

            <div className="my-5 border-t border-dashed border-gray-200" />

            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total Payable:</span>
              <span className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                ₹{Number(summary?.total_amount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/3 rounded-xl bg-gray-100 p-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handlePayNow}
                disabled={paymentLoading}
                className="
                  flex w-2/3 items-center justify-center gap-2 rounded-xl 
                  bg-[var(--color-text-primary)] p-3.5 text-sm font-bold text-white 
                  shadow-sm transition hover:opacity-90 disabled:opacity-50 cursor-pointer
                "
              >
                {paymentLoading ? "Connecting Gateway..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUCCESS MODAL WITH CONFETTI
      ========================================== */}
      {successModal.show && (
        <PaymentSuccessModal
          message={successModal.message}
          onClose={() => {
            setSuccessModal({ show: false, message: "" });
            router.push("/orders");
          }}
        />
      )}

      {/* RAZORPAY SCRIPT */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </div>
  );
}