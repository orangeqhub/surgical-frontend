"use client";

export default function CardPaymentForm({
  orderId,
  loading,
  error,
  success,
  createOrder,
  handlePaymentSuccess,
}) {

  // =========================
  // HANDLE PAYMENT
  // =========================
  const handleSubmit =
    async () => {

      try {

        // =========================
        // CREATE ORDER
        // =========================
        let finalOrderId =
          orderId;

        if (!finalOrderId) {

          finalOrderId =
            await createOrder(
              "card"
            );
        }

        console.log(
          "FINAL ORDER ID:",
          finalOrderId
        );

        if (!finalOrderId) {
          alert(
            "Order creation failed"
          );

          return;
        }

        // =========================
        // DEMO TRANSACTION ID
        // =========================
        const transactionId =
          `CARD-${Date.now()}`;

        // =========================
        // PAYMENT SUCCESS
        // =========================
        const response =
          await handlePaymentSuccess({
            order_id:
              finalOrderId,

            transaction_id:
              transactionId,
          });

        if (
          response.success
        ) {

          alert(
            "Payment Successful"
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-black">
        Card Payment
      </h2>

      {/* ERROR */}
      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* SUCCESS */}
      {success && (
        <p className="mt-4 text-sm text-green-600">
          Payment successful
        </p>
      )}

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 h-12 w-full rounded-2xl bg-black text-sm font-semibold text-white"
      >
        {loading
          ? "Processing..."
          : "Test Card Payment"}
      </button>
    </div>
  );
}