"use client";

import { useState } from "react";

export default function NetBanking({
  loading,
  error,
  success,
  handlePaymentSuccess,
}) {

  const [bank, setBank] =
    useState("");

  const handleBankPayment =
    async () => {

      if (!bank) {
        alert(
          "Please select a bank"
        );

        return;
      }

      const transactionId =
        `BANK-${Date.now()}`;

      const response =
        await handlePaymentSuccess({
          order_id:
            "demo-order-id",
          transaction_id:
            transactionId,
      });

      if (response.success) {
        alert(
          "Payment Successful"
        );
      }
    };

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-black">
        Net Banking
      </h2>

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Select Bank
        </label>

        <select
          value={bank}
          onChange={(e) =>
            setBank(
              e.target.value
            )
          }
          className="h-12 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-black"
        >
          <option value="">
            Select Your Bank
          </option>

          <option>
            HDFC Bank
          </option>

          <option>
            SBI Bank
          </option>

          <option>
            ICICI Bank
          </option>

          <option>
            Axis Bank
          </option>
        </select>

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
          onClick={
            handleBankPayment
          }
          disabled={loading}
          className="mt-5 h-12 w-full rounded-2xl bg-black text-sm font-semibold text-white"
        >
          {loading
            ? "Processing..."
            : "Continue To Bank"}
        </button>
      </div>
    </div>
  );
}