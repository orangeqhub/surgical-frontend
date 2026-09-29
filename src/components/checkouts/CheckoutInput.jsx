"use client";

import Text from "@/components/ui/Text";

export default function CheckoutInput({
  label,
  required,
  ...props
}) {
  return (
    <div>
      <Text
        variant="bodySmall"
        className="mb-2 font-medium text-black"
      >
        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </Text>

      <input
        {...props}
        className="
          h-12
          w-full
          rounded-lg
          border
          border-gray-200
          px-4
          text-sm
          outline-none
          focus:border-[var(--color-text-primary)]
        "
      />
    </div>
  );
}