"use client";

import { useDispatch, useSelector } from "react-redux";
import { setCartQty } from "@/redux/cartSlice";
import {
  addToCartService,
  removeCartItemService,
} from "@/services/cart.service";

export default function useCart() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  // Helper to safely fetch and auto-sanitize guestCart from localStorage
  const getCleanGuestCart = () => {
    if (typeof window === "undefined") return [];
    try {
      const raw = JSON.parse(localStorage.getItem("guestCart")) || [];
      const clean = raw.filter(
        (item) =>
          item?.product_id &&
          item.product_id !== "[object Object]" &&
          typeof item.product_id === "string"
      );
      if (clean.length !== raw.length) {
        localStorage.setItem("guestCart", JSON.stringify(clean));
      }
      return clean;
    } catch {
      return [];
    }
  };

  // ==========================================
  // ADD / UPDATE CART ITEM
  // ==========================================
  const addCart = async (
    productIdParam,
    quantityParam = 1,
    productDataParam = null,
    variantIdParam = null
  ) => {
    try {
      // Normalize arguments (Handles both Object & Positional parameters)
      let productId = productIdParam;
      let quantity = quantityParam;
      let productData = productDataParam;
      let variantId = variantIdParam;

      if (typeof productIdParam === "object" && productIdParam !== null) {
        productId =
          productIdParam.productId ||
          productIdParam.id ||
          productIdParam.product_id;
        quantity = productIdParam.quantity ?? quantityParam ?? 1;
        productData =
          productIdParam.product ||
          productIdParam.productData ||
          productDataParam;
        variantId =
          productIdParam.variantId ||
          productIdParam.variant_id ||
          variantIdParam;
      }

      // Safety Guard: ensure productId is a valid primitive string or number
      if (!productId || typeof productId === "object") {
        console.error("Invalid productId passed to addCart:", productIdParam);
        return { success: false, message: "Invalid product ID" };
      }

      // Logged-In User Flow
      if (user?.id) {
        const response = await addToCartService(productId, quantity, variantId);
        if (response?.success) {
          dispatch(setCartQty({ productId, quantity }));
          window.dispatchEvent(new Event("cartUpdated"));
        }
        return response;
      }

      // Guest User Flow (localStorage)
      let guestCart = getCleanGuestCart();

      const existingItemIndex = guestCart.findIndex(
        (item) =>
          String(item.product_id) === String(productId) &&
          String(item.variant_id || "") === String(variantId || "")
      );

      const selectedVariant = productData?.variants?.find(
        (v) => String(v.id) === String(variantId)
      );

      if (existingItemIndex > -1) {
        guestCart[existingItemIndex].quantity = Number(quantity) || 1;
        if (productData) {
          guestCart[existingItemIndex].product = productData;
          guestCart[existingItemIndex].name = productData.name;
          guestCart[existingItemIndex].sale_price = Number(
            selectedVariant?.sale_price ?? productData.sale_price ?? 0
          );
          guestCart[existingItemIndex].mrp = Number(
            selectedVariant?.mrp ?? productData.mrp ?? 0
          );
          guestCart[existingItemIndex].thumbnail_url =
            productData.thumbnail_url || productData.images?.[0]?.image_url;
        }
      } else {
        guestCart.push({
          cart_id: `guest_${Date.now()}_${productId}_${variantId || "default"}`,
          product_id: String(productId),
          variant_id: variantId ? String(variantId) : null,
          quantity: Number(quantity) || 1,
          name: productData?.name || "Product",
          sku: selectedVariant?.sku || productData?.sku || "N/A",
          brand: productData?.brand || "N/A",
          category_name: productData?.category?.name || "N/A",
          variant_size: selectedVariant?.size || null,
          sale_price: Number(
            selectedVariant?.sale_price ?? productData?.sale_price ?? 0
          ),
          mrp: Number(selectedVariant?.mrp ?? productData?.mrp ?? 0),
          thumbnail_url:
            productData?.thumbnail_url || productData?.images?.[0]?.image_url,
          product: productData || {},
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      dispatch(setCartQty({ productId, quantity }));
      window.dispatchEvent(new Event("cartUpdated"));
      return { success: true };
    } catch (error) {
      console.error("Add Cart Error:", error);
      return { success: false };
    }
  };

  // ==========================================
  // REMOVE CART ITEM
  // ==========================================
  const removeItem = async (productIdParam, variantIdParam = null) => {
    try {
      let productId = productIdParam;
      let variantId = variantIdParam;

      // Normalize parameters if object was passed
      if (typeof productIdParam === "object" && productIdParam !== null) {
        productId =
          productIdParam.productId ||
          productIdParam.id ||
          productIdParam.product_id;
        variantId =
          productIdParam.variantId ||
          productIdParam.variant_id ||
          variantIdParam;
      } else if (typeof variantIdParam === "object" && variantIdParam !== null) {
        variantId = variantIdParam.id || variantIdParam.variant_id;
      }

      if (!productId || typeof productId === "object") {
        console.error("Invalid productId passed to removeItem:", productIdParam);
        return { success: false, message: "Invalid product ID" };
      }

      // Logged-In User Flow (Calls DELETE /api/v1/customer/cart/remove/{product_id}/{variant_id})
      if (user?.id) {
        const response = await removeCartItemService(productId, variantId);
        if (response?.success) {
          dispatch(setCartQty({ productId, quantity: 0 }));
          window.dispatchEvent(new Event("cartUpdated"));
        }
        return response;
      } 
      
      // Guest User Flow (localStorage)
      else {
        let guestCart = getCleanGuestCart();

        guestCart = guestCart.filter((item) => {
          const isSameProduct = String(item.product_id) === String(productId);
          const itemVariant = item.variant_id ? String(item.variant_id) : null;
          const targetVariant = variantId ? String(variantId) : null;

          if (targetVariant) {
            return !(isSameProduct && itemVariant === targetVariant);
          }
          return !isSameProduct;
        });

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        dispatch(setCartQty({ productId, quantity: 0 }));
        window.dispatchEvent(new Event("cartUpdated"));
        return { success: true };
      }
    } catch (error) {
      console.error("Remove Item Error:", error);
      return { success: false };
    }
  };

  // ==========================================
  // SYNC GUEST CART TO BACKEND ON LOGIN
  // ==========================================
  const syncGuestCart = async () => {
    try {
      let guestCart = getCleanGuestCart();
      if (guestCart.length === 0) return { success: true };

      for (const item of guestCart) {
        try {
          await addToCartService(
            item.product_id,
            item.quantity,
            item.variant_id
          );
        } catch (itemError) {
          console.error(`Failed to sync item ${item.product_id}:`, itemError);
        }
      }

      localStorage.removeItem("guestCart");
      window.dispatchEvent(new Event("cartUpdated"));
      return { success: true };
    } catch (error) {
      console.error("Sync Cart Error:", error);
      return { success: false };
    }
  };

  return {
    addCart,
    removeItem,
    syncGuestCart,
  };
}













