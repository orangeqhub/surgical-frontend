"use client";

import {
  PackageCheck,
  CreditCard,
  Star,
} from "lucide-react";

export default function OrderCard({
  order,
  onReview,
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center md:justify-between">
        {/* LEFT */}
        <div className="flex flex-1 gap-5">
          {/* PRODUCT IMAGE */}
          <div className="relative">
            <img
              src={
                order?.image_url ||
                "/placeholder.png"
              }
              alt={
                order?.product_name ||
                "Product"
              }
              className="
                h-28
                w-28
                rounded-2xl
                border
                border-gray-200
                object-cover
                bg-gray-100
              "
            />

            {/* STATUS BADGE */}
            <div
              className="
                absolute
                bottom-2
                left-2
                rounded-full
                bg-white
                px-2
                py-1
                text-[10px]
                font-semibold
                text-green-600
                shadow
              "
            >
              {order?.status}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center">
            {/* STATUS */}
            <div className="mb-2 flex items-center gap-2">
              <PackageCheck
                size={18}
                className="text-green-600"
              />

              <span className="capitalize text-sm font-medium text-green-600">
                {order?.status}
              </span>
            </div>

            {/* PRODUCT NAME */}
            <h3 className="text-lg font-semibold text-black">
              {order?.product_name ||
                "Product"}
            </h3>

            {/* ORDER NUMBER */}
            <p className="mt-1 text-sm text-gray-500">
              Order Number:
              <span className="ml-1 font-medium text-black">
                {order?.order_number}
              </span>
            </p>

            {/* PAYMENT */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <CreditCard size={16} />

              <span className="capitalize">
                Payment:
                {" "}
                {order?.payment_status}
              </span>
            </div>

            {/* PRODUCT ID */}
            <div className="mt-2 text-sm text-gray-500">
              Product ID:
              <span className="ml-1 font-medium text-black">
                {order?.product_id
                  ?.slice(0, 10)}
                ...
              </span>
            </div>

            {/* AMOUNT */}
            <p className="mt-4 text-2xl font-bold text-black">
              ₹
              {Number(
                order?.total_amount || 0
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-start gap-3 md:items-end">
          <button
            onClick={onReview}
            className="
              inline-flex
              items-center
              gap-2
              rounded-2xl
              bg-black
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:scale-[1.02]
              hover:opacity-90
            "
          >
            <Star size={16} />

            Write Review
          </button>

          <p className="text-xs text-gray-400">
            Share your product
            experience
          </p>
        </div>
      </div>
    </div>
  );
}