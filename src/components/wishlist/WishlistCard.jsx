"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Eye, Loader2 } from "lucide-react";
import Text from "@/components/ui/Text";

export default function WishlistCard({ product, removeFromWishlist }) {
  const [removing, setRemoving] = useState(false);

  const productId =
    product?.product_id ||
    product?.id ||
    product?.product?.product_id ||
    product?.product?.id;

  const productName = product?.name || product?.product?.name || "Product";
  const brandName = product?.brand || product?.product?.brand || "N/A";
  const skuCode =
    product?.skus?.[0] ||
    product?.sku ||
    product?.product?.sku ||
    product?.variants?.[0]?.sku ||
    "N/A";
  const shortDescription =
    product?.short_description || product?.product?.short_description || "";

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      console.error("Missing product_id for removal:", product);
      return;
    }

    if (removeFromWishlist) {
      try {
        setRemoving(true);
        await removeFromWishlist(productId);
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
      } finally {
        setRemoving(false);
      }
    }
  };

  // =========================
  // SAFE IMAGE
  // =========================
  const rawImage =
    product?.thumbnail_url ||
    product?.product?.thumbnail_url ||
    product?.images?.[0]?.image_url;

  const imageSrc =
    rawImage &&
    typeof rawImage === "string" &&
    rawImage.startsWith("http") &&
    !rawImage.includes("::")
      ? rawImage
      : "/images/product-placeholder.png";

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      {/* TOP: IMAGE */}
      <Link href={`/products/${productId || ""}`}>
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain p-2.5 transition-transform duration-300 group-hover:scale-105"
          />

          {/* STOCK BADGE */}
          {product?.stock_status && (
            <div className="absolute left-1.5 top-1.5">
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white ${
                  product?.stock_status === "In Stock"
                    ? "bg-green-600"
                    : "bg-red-500"
                }`}
              >
                {product?.stock_status}
              </span>
            </div>
          )}

          {/* DISCOUNT BADGE */}
          {product?.discount_percentage > 0 && (
            <div className="absolute right-1.5 top-1.5">
              <span className="rounded-full bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {product?.discount_percentage}% OFF
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* BOTTOM: CONTENT */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          {/* NAME */}
          <Text
            variant="body2"
            className="line-clamp-1 text-xs font-semibold text-gray-900 sm:text-sm"
          >
            {productName}
          </Text>

          {/* BRAND + SKU */}
          <div className="mt-1 text-[11px] text-gray-400">
            <p className="truncate">Brand: {brandName}</p>
            <p className="truncate">SKU: {skuCode}</p>
          </div>

          {/* RATING */}
          <div className="mt-1 text-[11px] text-gray-500">
            ⭐ {Number(product?.rating || 0).toFixed(1)} (
            {product?.review_count || 0})
          </div>
        </div>

        <div>
          {/* SHORT DESCRIPTION (Replaces Price Section) */}
          {shortDescription && (
            <Text className="mt-2 line-clamp-2 text-[11px] text-gray-600">
              {shortDescription}
            </Text>
          )}

          {/* ACTIONS */}
          <div className="mt-3 flex gap-1.5">
            {/* VIEW DETAILS */}
            <Link
              href={`/products/${productId || ""}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--color-text-primary)] py-1.5 text-xs font-medium text-white transition hover:opacity-90"
              title="View Details"
            >
              <Eye size={14} />
              <span>View Details</span>
            </Link>

            {/* REMOVE FROM WISHLIST */}
            <button
              type="button"
              disabled={removing}
              onClick={handleRemove}
              className="rounded-md border px-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
              title="Remove from Wishlist"
            >
              {removing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}