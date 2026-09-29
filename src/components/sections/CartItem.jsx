"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import Text from "@/components/ui/Text";
import useCart from "@/hooks/useCart";

export default function CartItem({ item = {}, fetchCart }) {
  const { addCart, removeItem } = useCart();

  // Extract nested product and variant objects safely
  const productData = item?.product || item?.product_id || item;
  const variantData = item?.variant || item?.variant_id || {};

  // Safely extract primitive string IDs
  const productId =
    typeof item?.product_id === "object"
      ? item.product_id?.id || item.product_id?._id
      : item?.product_id || item?.product?.id || item?.id;

  const variantId =
    typeof item?.variant_id === "object"
      ? item.variant_id?.id
      : item?.variant_id || variantData?.id || null;

  // Resolved metadata with fallbacks
  const name = item?.name || productData?.name || "Unknown Product";
  const sku = item?.sku || variantData?.sku || productData?.sku || "N/A";
  const brand = item?.brand || productData?.brand || "N/A";
  const categoryName =
    item?.category_name ||
    productData?.category?.name ||
    productData?.category_name ||
    "N/A";

  const thumbnailUrl =
    item?.thumbnail_url ||
    productData?.thumbnail_url ||
    productData?.images?.[0]?.image_url;

  // Pricing (Guaranteed numeric)
  const salePrice = Number(
    variantData?.sale_price ??
      productData?.sale_price ??
      item?.sale_price ??
      0
  );

  const mrp = Number(
    variantData?.mrp ??
      productData?.mrp ??
      item?.mrp ??
      0
  );

  const [qty, setQty] = useState(Number(item.quantity) || 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQty(Number(item.quantity) || 1);
  }, [item.quantity]);

  const itemTotal = (Number(qty) || 0) * salePrice;

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (newQty) => {
    if (loading || newQty < 1) return;

    try {
      setLoading(true);

      const response = await addCart(productId, newQty, item, variantId);

      if (response?.success) {
        setQty(newQty);
        if (fetchCart) await fetchCart(false);
      }
    } catch (error) {
      console.error("Quantity Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const handleRemove = async () => {
    try {
      setLoading(true);

      const response = await removeItem(productId, variantId);

      if (response?.success) {
        if (fetchCart) await fetchCart(false);
      }
    } catch (error) {
      console.error("Remove Item Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Product Image Link */}
        <Link href={`/products/${productId}`} className="shrink-0">
          <div className="overflow-hidden rounded-xl border bg-gray-50 flex items-center justify-center h-[120px] w-[120px] cursor-pointer hover:opacity-90 transition">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={name}
                width={120}
                height={120}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xs text-gray-400 font-medium">
                No Image
              </span>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1">
          <Text variant="h5" className="text-black font-bold">
            {name}
          </Text>

          <Text className="mt-1 text-sm text-gray-500">SKU: {sku}</Text>

          {item?.variant_size && (
            <Text className="mt-1 text-sm text-gray-500">
              Size: {item.variant_size}
            </Text>
          )}

          <Text className="mt-1 text-sm text-gray-500">Brand: {brand}</Text>

          <Text className="mt-1 text-sm text-gray-500">
            Category: {categoryName}
          </Text>

          {/* PRICE */}
          <div className="mt-3 flex items-center gap-3">
            <Text variant="h5" className="text-emerald-600 font-bold">
              ₹{salePrice.toLocaleString("en-IN")}
            </Text>

            {mrp > salePrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* ITEM TOTAL */}
          <Text className="mt-2 font-semibold text-emerald-600">
            Total: ₹{itemTotal.toLocaleString("en-IN")}
          </Text>

          {/* ACTIONS */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* QUANTITY CONTROLS */}
            <div className="flex items-center rounded-xl border">
              <button
                type="button"
                disabled={loading || qty <= 1}
                onClick={() => updateQuantity(qty - 1)}
                className="flex h-10 w-10 items-center justify-center hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                <Minus size={18} />
              </button>

              <span className="min-w-[50px] text-center font-semibold">
                {qty}
              </span>

              <button
                type="button"
                disabled={loading}
                onClick={() => updateQuantity(qty + 1)}
                className="flex h-10 w-10 items-center justify-center hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* REMOVE BUTTON */}
            <button
              type="button"
              disabled={loading}
              onClick={handleRemove}
              className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-red-500 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={18} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}