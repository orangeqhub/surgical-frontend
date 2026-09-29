"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Heart,
  ShoppingCart,
  Star,
  Scale,
  Ruler,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import { AuthModal } from "@/components";

import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";

export default function ProductCard({ product }) {
  const router = useRouter();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    fetchWishlist,
  } = useWishlist();

  const user = useSelector((state) => state.user?.user);
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(user?.id && token);

  const id = product?.id || product?.product_id;

  // Extract variant ID if product has variants
  const defaultVariant = product?.variants?.length > 0 ? product.variants[0] : null;
  const variantId = defaultVariant?.id || product?.variant_id || null;

  // Resolved pricing (Variant price -> Main product price)
  const salePrice = defaultVariant?.sale_price ?? product?.sale_price ?? 0;
  const mrp = defaultVariant?.mrp ?? product?.mrp ?? 0;

  const weight = product?.weight;
  const length = product?.length;
  const breadth = product?.breadth;
  const height = product?.height;

  const imageUrl =
    product?.thumbnail_url ||
    product?.images?.[0]?.image_url ||
    "/images/product-placeholder.png";

  // Fetch wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [fetchWishlist, isAuthenticated]);

  // ❤️ Wishlist Handler
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }

    try {
      if (isWishlisted(id)) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id);
      }
    } catch (error) {
      console.log("Wishlist Error:", error);
    }
  };

  // 🛒 Add Cart / View Cart Handler
  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If already added, redirect to cart page
    if (addedToCart) {
      router.push("/cart");
      return;
    }

    if (addingCart) return;

    try {
      setAddingCart(true);

      // ✅ PASSING ALL 4 PARAMETERS: (productId, quantity, productData, variantId)
      const response = await addCart(id, 1, product, variantId);

      if (response?.success) {
        setAddedToCart(true);
      }
    } catch (error) {
      console.log("Add to Cart Error:", error);
    } finally {
      setAddingCart(false);
    }
  };

  return (
    <>
      <div
        className="
          group flex h-full flex-col overflow-hidden
          rounded-xl border border-gray-200
          bg-white shadow-sm
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-lg
        "
      >
        {/* IMAGE */}
        <Link href={`/products/${id}`}>
          <div
            className="
              relative aspect-square overflow-hidden
              bg-gray-100
            "
          >
            <Image
              src={imageUrl}
              alt={product?.name || "Product"}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="
                object-contain p-3
                transition-transform duration-300
                group-hover:scale-105
              "
            />

            {/* ❤️ Wishlist Button */}
            <button
              onClick={handleWishlist}
              aria-label="Wishlist"
              className="
                absolute right-2 top-2 z-10
                flex h-9 w-9 items-center justify-center
                rounded-full bg-white shadow-md
                transition hover:scale-105
                active:scale-95 cursor-pointer
              "
            >
              <Heart
                size={16}
                fill={
                  isWishlisted(id)
                    ? "currentColor"
                    : "none"
                }
                className={
                  isWishlisted(id)
                    ? "text-red-500"
                    : "text-gray-600"
                }
              />
            </button>
          </div>
        </Link>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* PRODUCT NAME */}
          <Link href={`/products/${id}`}>
            <h3
              className="
                min-h-[44px]
                text-sm font-semibold text-gray-800
                line-clamp-2
                transition-colors
                hover:text-[var(--color-text-primary)]
                sm:text-base
              "
            >
              {product?.name}
            </h3>
          </Link>

          {/* ⭐ Rating */}
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
            <Star
              size={13}
              className="fill-yellow-400 text-yellow-400"
            />

            <span>
              {product?.rating || 0} ({product?.review_count || 0})
            </span>
          </div>

          {/* 💰 Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              ₹{salePrice.toLocaleString("en-IN")}
            </span>

            {mrp > salePrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* 🛒 Add to Cart / View Cart */}
          <div className="mt-auto pt-4 flex gap-2">
            <button
              onClick={handleCart}
              disabled={
                addingCart ||
                product?.stock_qty === 0
              }
              className={`
                flex flex-1 items-center justify-center gap-2
                rounded-lg
                px-3 py-2.5
                text-sm font-medium text-white
                transition-all duration-200
                active:scale-95 cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-70
                ${
                  product?.stock_qty === 0
                    ? "bg-gray-400"
                    : addedToCart
                    ? "bg-[var(--color-text-primary)]"
                    : "bg-[var(--color-text-primary)] hover:opacity-90"
                }
              `}
            >
              <ShoppingCart size={16} />

              {product?.stock_qty === 0
                ? "Out of Stock"
                : addingCart
                ? "Adding..."
                : addedToCart
                ? "View Cart"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}














