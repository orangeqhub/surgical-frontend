import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setWishlist: (
      state,
      action
    ) => {
      state.items =
        action.payload;
    },

    addWishlist: (
      state,
      action
    ) => {
      const exists =
        state.items.includes(
          action.payload
        );

      if (!exists) {
        state.items.push(
          action.payload
        );

        localStorage.setItem(
          "wishlist",
          JSON.stringify(
            state.items
          )
        );
      }
    },

    removeWishlist: (
      state,
      action
    ) => {
      state.items =
        state.items.filter(
          (id) =>
            id !==
            action.payload
        );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(
          state.items
        )
      );
    },

    clearWishlist: (
      state
    ) => {
      state.items = [];

      localStorage.removeItem(
        "wishlist"
      );
    },
  },
});

export const {
  setWishlist,
  addWishlist,
  removeWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;