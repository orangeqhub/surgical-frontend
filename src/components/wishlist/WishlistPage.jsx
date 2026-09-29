"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";

import useWishlist from "@/hooks/useWishlist";

import WishlistGrid from "./WishlistGrid";
import EmptyWishlist from "./EmptyWishlist";

export default function WishlistPage() {
  const user = useSelector((state) => state.user?.user);
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(user?.id && token);

  const {
    wishlist,
    loading,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlist();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [fetchWishlist, isAuthenticated]);

  return (
    <section className="py-6 sm:py-8">
      <Container>

        {/* HEADER */}
        <div className="
          mb-6 sm:mb-8
          flex flex-col sm:flex-row
          gap-2 sm:items-center sm:justify-between
        ">

          <Text variant="h3" className="text-xl sm:text-2xl">
            My Wishlist
          </Text>

          <Text className="text-sm sm:text-base text-gray-600">
            {wishlist?.length || 0} Items
          </Text>

        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            Loading...
          </div>
        ) : wishlist?.length > 0 ? (
          <WishlistGrid
            wishlist={wishlist}
            removeFromWishlist={removeFromWishlist}
          />
        ) : (
          <div className="py-10">
            <EmptyWishlist
              title="Your wishlist is empty"
              description="Save products you love."
              buttonText="Explore Products"
              buttonLink="/products"
            />
          </div>
        )}

      </Container>
    </section>
  );
}