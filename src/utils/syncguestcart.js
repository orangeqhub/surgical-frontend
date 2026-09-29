import { addToCartService } from "@/services/cart.service";

const CART_KEY = "guest_cart";

export const syncGuestCart = async () => {
  const cart = JSON.parse(
    localStorage.getItem(CART_KEY) || "[]"
  );

  if (!cart.length) return;

  for (const item of cart) {
    await addToCartService(
      item.productId,
      item.quantity
    );
  }

  localStorage.removeItem(CART_KEY);

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};