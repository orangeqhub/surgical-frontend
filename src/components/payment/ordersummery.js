// "use client";
 
// import {
//   TicketPercent,
//   ShoppingBag,
//   Truck,
//   Wallet,
// } from "lucide-react";
 
// // 🌟 Receive cartSummaryHooks as a prop from PaymentPageContent
// export default function PaymentSummary({ cartSummaryHooks }) {
//   const {
//     summary,
//     selectedCoupon,
//     loading,
//     couponLoading,
//     applyCoupon,
//     removeCoupon,
//   } = cartSummaryHooks;
 
//   if (loading || !summary) {
//     return (
//       <div className="sticky top-24 rounded-3xl border bg-white p-6 shadow-sm">
//         Loading Summary...
//       </div>
//     );
//   }
 
//   return (
//     <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
//       {/* HEADER */}
//       <div className="flex items-center gap-3">
//         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-text-primary)] text-white">
//           <Wallet size={22} />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-black">Payment Summary</h2>
//           <p className="text-sm text-gray-500">Secure checkout overview</p>
//         </div>
//       </div>
 
//       {/* BODY */}
//       <div className="mt-8 space-y-5">
//         {/* ITEMS */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-gray-100 p-2">
//               <ShoppingBag size={18} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Items</p>
//               <p className="font-semibold">{summary?.total_items || 0} Items</p>
//             </div>
//           </div>
//           <span className="font-bold">
//             ₹{Number(summary?.subtotal || 0).toLocaleString()}
//           </span>
//         </div>
 
//         {/* SHIPPING */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-gray-100 p-2">
//               <Truck size={18} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Delivery Charges</p>
//               <p className="font-semibold">Shipping</p>
//             </div>
//           </div>
//           {summary?.shipping_charge === 0 ? (
//             <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
//               Free
//             </span>
//           ) : (
//             <span className="font-bold">
//               ₹{Number(summary?.shipping_charge || 0).toLocaleString()}
//             </span>
//           )}
//         </div>
 
//         {/* COUPONS LIST */}
//         {summary?.available_coupons?.length > 0 && !selectedCoupon && (
//           <div className="space-y-3">
//             <h3 className="font-semibold">Available Coupons</h3>
//             {summary.available_coupons.map((coupon) => (
//               <div
//                 key={coupon.coupon_id || coupon.coupon_code}
//                 className="flex items-center justify-between rounded-2xl border p-4"
//               >
//                 <div>
//                   <p className="font-bold">{coupon.coupon_code}</p>
//                   <p className="text-sm text-gray-500">
//                     Save ₹{coupon.discount_amount}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => applyCoupon(coupon.coupon_code)}
//                   disabled={couponLoading}
//                   className="rounded-xl bg-[var(--color-text-primary)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--color-text-primary)]"
//                 >
//                   {couponLoading ? "Applying..." : "Apply"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
 
//         {/* SELECTED COUPON */}
//         {selectedCoupon && (
//           <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4">
//             <div className="flex items-center gap-3">
//               <div className="rounded-xl bg-green-100 p-2 text-green-700">
//                 <TicketPercent size={18} />
//               </div>
//               <div>
//                 <p className="text-sm text-green-700">Coupon Applied</p>
//                 <p className="font-bold text-green-900">
//                   {selectedCoupon.coupon_code}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={removeCoupon}
//               className="text-sm font-semibold text-red-500 hover:underline"
//             >
//               Remove
//             </button>
//           </div>
//         )}
 
//         {/* TOTAL */}
//         <div className="border-t pt-5">
//           <div className="rounded-2xl bg-[var(--color-text-primary)] p-5 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-300">Final Payable</p>
//                 <h3 className="mt-1 text-3xl font-bold">
//                   ₹{Number(summary?.total_amount || 0).toLocaleString()}
//                 </h3>
//               </div>
//               <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium">
//                 Secure Payment
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
 








"use client";

import {
  TicketPercent,
  ShoppingBag,
  Truck,
  Wallet,
  Percent,
} from "lucide-react";

import { useState } from "react";

// 🌟 Receive cartSummaryHooks and selectedAddress as props from PaymentPageContent
export default function PaymentSummary({ cartSummaryHooks, selectedAddress }) {
  const {
    summary,
    selectedCoupon,
    loading,
    couponLoading,
    applyCoupon,
    removeCoupon,
  } = cartSummaryHooks;

  // ✅ NEW STATE
  const [showCoupons, setShowCoupons] =
    useState(false);

  if (loading || !summary) {
    return (
      <div className="sticky top-24 rounded-3xl border bg-white p-6 shadow-sm">
        Loading Summary...
      </div>
    );
  }

  return (
    <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-text-primary)] text-white">
          <Wallet size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black">
            Payment Summary
          </h2>

          <p className="text-sm text-gray-500">
            Secure checkout overview
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="mt-8 space-y-5">
        {/* ITEMS & SUBTOTAL */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2">
              <ShoppingBag size={18} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Subtotal
              </p>

              <p className="font-semibold">
                {summary?.total_items || 0} Items
              </p>
            </div>
          </div>

          <span className="font-bold">
            ₹
            {Number(
              summary?.subtotal || 0
            ).toLocaleString()}
          </span>
        </div>

        {/* GST BREAKDOWN */}
        {summary?.is_andhra_pradesh ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <Percent size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">CGST (9%)</p>
                  <p className="text-xs text-gray-400">Central GST</p>
                </div>
              </div>
              <span className="font-bold">
                ₹{Number(summary?.cgst_amount || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <Percent size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">SGST (9%)</p>
                  <p className="text-xs text-gray-400">State GST (Andhra Pradesh)</p>
                </div>
              </div>
              <span className="font-bold">
                ₹{Number(summary?.sgst_amount || 0).toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
                <Percent size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">IGST (18%)</p>
                <p className="text-xs text-gray-400">Integrated GST ({summary?.customer_state || "Outside AP"})</p>
              </div>
            </div>
            <span className="font-bold">
              ₹{Number(summary?.igst_amount || 0).toLocaleString()}
            </span>
          </div>
        )}

        {/* SHIPPING */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2">
              <Truck size={18} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Delivery Charges
              </p>

              <p className="font-semibold">
                Shipping
              </p>
            </div>
          </div>

          {summary?.shipping_charge ===
          0 ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Free
            </span>
          ) : (
            <span className="font-bold">
              ₹
              {Number(
                summary?.shipping_charge || 0
              ).toLocaleString()}
            </span>
          )}
        </div>

        {/* COUPONS */}
        {summary?.available_coupons
          ?.length > 0 &&
          !selectedCoupon && (
            <div className="space-y-3">
              {/* TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setShowCoupons(
                    !showCoupons
                  )
                }
                className="flex w-full items-center justify-between rounded-2xl border p-4 transition hover:border-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gray-100 p-2">
                    <TicketPercent
                      size={18}
                    />
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold">
                      Available Coupons
                    </h3>

                    <p className="text-sm text-gray-500">
                      Click to view
                      coupons
                    </p>
                  </div>
                </div>

                <span className="text-xl font-bold">
                  {showCoupons
                    ? "−"
                    : "+"}
                </span>
              </button>

              {/* COUPON LIST */}
              {showCoupons && (
                <div className="space-y-3">
                  {summary.available_coupons.map(
                    (coupon) => {
                      const isDisabled =
                        !coupon?.is_applicable;

                      return (
                        <div
                          key={
                            coupon.coupon_id ||
                            coupon.coupon_code
                          }
                          className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                            isDisabled
                              ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-60"
                              : "border-gray-200 hover:border-[var(--color-text-primary)]"
                          }`}
                        >
                          <div>
                            <p className="font-bold">
                              {
                                coupon.coupon_code
                              }
                            </p>

                            <p className="text-sm text-gray-500">
                              Save ₹
                              {
                                coupon.discount_amount
                              }
                            </p>

                            {/* ❌ REASON */}
                            {isDisabled && (
                              <p className="mt-1 text-xs text-red-500">
                                {coupon.reason ||
                                  "Coupon not applicable"}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              applyCoupon(
                                coupon.coupon_code
                              )
                            }
                            disabled={
                              couponLoading ||
                              isDisabled
                            }
                            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ${
                              isDisabled
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)]"
                            }`}
                          >
                            {couponLoading
                              ? "Applying..."
                              : isDisabled
                              ? "Unavailable"
                              : "Apply"}
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}

        {/* SELECTED COUPON */}
        {selectedCoupon && (
          <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-2 text-green-700">
                <TicketPercent size={18} />
              </div>

              <div>
                <p className="text-sm text-green-700">
                  Coupon Applied
                </p>

                <p className="font-bold text-green-900">
                  {
                    selectedCoupon.coupon_code
                  }
                </p>
              </div>
            </div>

            <button
              onClick={removeCoupon}
              className="text-sm font-semibold text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* TOTAL */}
        <div className="border-t pt-5">
          <div className="rounded-2xl bg-[var(--color-text-primary)] p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">
                  Final Payable
                </p>

                <h3 className="mt-1 text-3xl font-bold">
                  ₹
                  {Number(
                    summary?.total_amount || 0
                  ).toLocaleString()}
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium">
                Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}












