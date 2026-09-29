import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items:
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("cart")
        ) || []
      : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCartQty: (
      state,
      action
    ) => {
      const {
        productId,
        quantity,
      } = action.payload;

      const existing =
        state.items.find(
          (item) =>
            item.productId ===
            productId
        );

      if (quantity === 0) {
        state.items =
          state.items.filter(
            (item) =>
              item.productId !==
              productId
          );
      } else if (existing) {
        existing.quantity =
          quantity;
      } else {
        state.items.push({
          productId,
          quantity,
        });
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(
          state.items
        )
      );
    },

    clearCart: (state) => {
      state.items = [];

      localStorage.removeItem(
        "cart"
      );
    },
  },
});

export const {
  setCartQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;