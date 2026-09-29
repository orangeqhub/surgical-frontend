"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

export default function CartSummary({ summary = {} }) {
  const router = useRouter();
  const user = useSelector((state) => state.user?.user);

  // Cast values safely to Numbers to prevent NaN console errors
  const totalItems = Number(summary?.total_items) || 0;
  const subtotal = Number(summary?.subtotal) || 0;

  const handleCheckout = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    if (!user?.id) {
      router.push("?auth=checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs">
      <Text variant="h4" className="mb-5 text-black font-bold text-lg sm:text-xl">
        Order Summary
      </Text>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm sm:text-base">
          <Text className="text-gray-600">Total Units</Text>
          <Text className="font-medium text-black">{totalItems}</Text>
        </div>

        <div className="flex justify-between items-center text-sm sm:text-base">
          <Text className="text-gray-600">Subtotal</Text>
          <Text className="font-medium text-black">
            ₹{subtotal.toLocaleString("en-IN")}
          </Text>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <Text variant="h5" className="text-black font-bold">
            Total
          </Text>

          <Text variant="h5" className="text-text-primary font-bold text-lg">
            ₹{subtotal.toLocaleString("en-IN")}
          </Text>
        </div>
      </div>

      <Button 
        className="mt-6 w-full h-12 rounded-xl text-sm font-semibold shadow-xs transition active:scale-[0.99]" 
        onClick={handleCheckout}
      >
        Proceed To Checkout
      </Button>
    </div>
  );
}