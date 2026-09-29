"use client";

import PaymentPageContent from "@/components/payment/paymentpage";

export default function PaymentPage() {
  // DUMMY CART DATA
  const cartItems = [
    {
      id: 1,
      name: "Digital BP Monitor",
      quantity: 1,
      price: 1499,
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=400",
    },
    {
      id: 2,
      name: "Premium Surgical Gloves",
      quantity: 2,
      price: 499,
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400",
    },
  ];

  const summary = {
    subtotal: 2497,
    total_items: 3,
  };

  return (
    <section className="bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <PaymentPageContent
          cartItems={cartItems}
          summary={summary}
        />
      </div>
    </section>
  );
}