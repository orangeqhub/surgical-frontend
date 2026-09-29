// src/app/cart/page.jsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

import useCartList from "@/hooks/useCartList";

import {
  CartItem,
  CartSummary,
  CartSkeleton,
  Container,
  Text,
  Button,
} from "@/components";

export default function CartPage() {
  const { cart: rawCart, summary, loading, fetchCart } = useCartList();

  useEffect(() => {
    fetchCart(true);
  }, []);

  // Filter out any corrupted or empty items safely
  const cart = (rawCart || []).filter((item) => {
    const hasValidId = item?.product_id && item.product_id !== "[object Object]";
    const hasValidName = item?.name || item?.product?.name;
    return hasValidId || hasValidName;
  });

  if (loading) {
    return (
      <Container className="py-10">
        <CartSkeleton />
      </Container>
    );
  }

  if (!cart?.length) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <div className="mb-4 text-5xl">🛒</div>

          <Text variant="h3" className="text-black">
            Your cart is empty
          </Text>

          <Text className="mt-2">
            Browse our bestsellers and add your favourites.
          </Text>

          <Link href="/products" className="mt-6 inline-block">
            <Button size="lg">Start Shopping →</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Text variant="h2" className="text-black">
          Shopping Cart
        </Text>

        <Text>
          {cart.length} Product(s) ({summary?.total_items || 0} Total Units) in your cart
        </Text>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left Side: Cart Items List */}
        <div>
          <div className="space-y-5">
            {cart.map((item, index) => {
              // Safely extract string ID whether cart_id is a string or object
              const rawCartId =
                typeof item?.cart_id === "object"
                  ? item.cart_id?.id || item.cart_id?._id
                  : item?.cart_id || item?.id || item?.product_id;

              // Unique React key combining ID, variant, and index
              const uniqueKey = `${rawCartId || "cart-item"}-${item?.variant_id || "default"}-${index}`;

              return (
                <CartItem
                  key={uniqueKey}
                  item={item}
                  fetchCart={fetchCart}
                />
              );
            })}
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-6">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto cursor-pointer"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <CartSummary summary={summary} />
      </div>
    </Container>
  );
}