"use client";

import { useState } from "react";

export default function UpiPayment({
  loading,
  error,
  success,
  handlePaymentSuccess,
}) {

  const [upiId, setUpiId] =
    useState("");

  const handlePay = async () => {

    if (!upiId) {
      alert("Enter UPI ID");
      return;
    }

    const transactionId =
      `UPI-${Date.now()}`;

    const response =
      await handlePaymentSuccess({
        order_id:
          "demo-order-id",
        transaction_id:
          transactionId,
      });

    if (response.success) {
      alert(
        "UPI Payment Successful"
      );
    }
  };

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-black">
        UPI Payment
      </h2>

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Enter UPI ID
        </label>

        <input
          type="text"
          placeholder="example@upi"
          value={upiId}
          onChange={(e) =>
            setUpiId(
              e.target.value
            )
          }
          className="h-12 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-black"
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-2 text-sm text-green-600">
            Payment successful
          </p>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-5 h-12 w-full rounded-2xl bg-black text-sm font-semibold text-white"
        >
          {loading
            ? "Processing..."
            : "Verify & Pay"}
        </button>
      </div>
    </div>
  );
}