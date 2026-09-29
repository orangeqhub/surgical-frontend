"use client";

import {
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";

import Button from "@/components/ui/Button";

export default function PaymentMethods({
  selected,
  setSelected,
}) {
  const methods = [
    {
      id: "card",
      title: "Credit / Debit Card",
      icon: CreditCard,
      desc: "Visa, Mastercard & RuPay",
    },
    {
      id: "upi",
      title: "UPI Payment",
      icon: Smartphone,
      desc: "PhonePe, GPay & Paytm",
    },
    {
      id: "bank",
      title: "Net Banking",
      icon: Landmark,
      desc: "All major banks supported",
    },
  ];

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">
          Select Payment Method
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Choose your preferred payment option
        </p>
      </div>

      {/* METHODS */}
      <div className="grid gap-4 md:grid-cols-3">
        {methods.map((method) => {
          const Icon = method.icon;

          const active =
            selected === method.id;

          return (
            <Button
              key={method.id}
              type="button"
              variant={
                active
                  ? "primary"
                  : "cart"
              }
              onClick={() =>
                setSelected(method.id)
              }
              className={`
                h-auto
                w-full
                flex-col
                items-start
                rounded-3xl
                border
                p-5
                text-left
                transition-all
                duration-200
                ${
                  active
                    ? "border-black"
                    : "border-gray-200 hover:border-black"
                }
              `}
            >
              {/* TOP */}
              <div className="flex w-full items-center justify-between">
                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    ${
                      active
                        ? "bg-white/10"
                        : "bg-gray-100"
                    }
                  `}
                >
                  <Icon size={24} />
                </div>

                {/* RADIO */}
                <div
                  className={`
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    transition
                    ${
                      active
                        ? "border-white"
                        : "border-gray-300"
                    }
                  `}
                >
                  {active && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <div className="mt-5">
                <h3 className="text-base font-semibold">
                  {method.title}
                </h3>

                <p
                  className={`
                    mt-2
                    text-sm
                    leading-6
                    ${
                      active
                        ? "text-gray-200"
                        : "text-gray-500"
                    }
                  `}
                >
                  {method.desc}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}