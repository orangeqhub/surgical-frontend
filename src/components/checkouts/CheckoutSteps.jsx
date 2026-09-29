"use client";

import Text from "@/components/ui/Text";

export default function CheckoutSteps({
  currentStep = 2,
}) {
  const steps = [
    "Cart",
    "Address",
    "Payment",
    "Confirm",
  ];

  return (
    <div className="mb-8 flex items-center justify-center gap-8">
      {steps.map(
        (step, index) => (
          <div
            key={step}
            className="flex items-center gap-2"
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                index + 1 <=
                currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>

            <Text
              variant="bodySmall"
              className={`font-medium ${
                index + 1 ===
                currentStep
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {step}
            </Text>
          </div>
        )
      )}
    </div>
  );
}