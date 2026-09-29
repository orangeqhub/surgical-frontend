"use client";

import WishlistCard from "./WishlistCard";

export default function WishlistGrid({
  wishlist = [],
  removeFromWishlist,
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
      {wishlist.map((item) => {
        const uniqueKey =
          item?.wishlist_id ||
          item?.product_id ||
          item?.id ||
          item?.product?.product_id ||
          item?.product?.id;

        return (
          <WishlistCard
            key={uniqueKey}
            product={item}
            removeFromWishlist={removeFromWishlist}
          />
        );
      })}
    </div>
  );
}