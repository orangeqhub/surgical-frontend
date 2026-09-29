export const API_ENDPOINTS = {
  REGISTER: "/api/v1/auth/register",
  LOGIN: "/api/v1/auth/login",
  GOOGLE_LOGIN: "/api/v1/auth/google",
  GOOGLE_OAUTH_LOGIN: "/api/v1/auth/google/login",
  GOOGLE_OAUTH_EXCHANGE: "/api/v1/auth/google/exchange",
  CATEGORIES: "/api/v1/store/categories",
  PRODUCTS: "/api/v1/store/products",
  PRODUCT_DETAILS: (id) => `/api/v1/store/products/${id}`,
  ADD_TO_CART: (id) => `/api/v1/customer/cart/add/${id}`,
  GET_CART: "/api/v1/customer/cart",
  // REMOVE_CART: (id) => `/api/v1/customer/cart/remove/${id}`,
  REMOVE_CART: (productId, variantId) => 
    `/api/v1/customer/cart/remove/${productId}/${variantId}`,
  GET_ADDRESSES: "/api/v1/customer/addresses",
  CREATE_ADDRESS: "/api/v1/customer/addresses",
  GET_ADDRESS: `/api/v1/customer/addresses/{address_id}`,
  UPDATE_ADDRESS: `/api/v1/customer/addresses/{address_id}`,
  DELETE_ADDRESS: `/api/v1/customer/addresses/{address_id}`,
  GET_ORDERS:`/api/v1/customer/orders`,
  GET_ORDERBYID:`/api/v1/customer/orders/{order_id}`,
  CREATE_REVIEW:`/api/v1/customer/reviews`,
  PAYMENT:`/api/v1/customer/orders/payment-success`,
  CREATE_ORDER:`api/v1/customer/orders`,
  CART_SUMMERY:`api/v1/customer/cart/summary`,
  APPLY_COUPON: "/api/v1/customer/cart/apply-coupon",
 
  CREATE_RAZORPAY_PAYMENT: "/api/v1/billing/create-payment",
  VERIFY_RAZORPAY_PAYMENT: "/api/v1/billing/verify-payment",
  GET_BANNER:`api/v1/banners`,
  CHECK_SERVICEABILITY: "/api/v1/shipping/check-serviceability",
 
  TRACK_ORDER: (orderId) => `/api/v1/shipping/track-order/${orderId}`,
  ESTIMATE_DELIVERY: "/api/v1/shipping/estimate-delivery",
 
 
 
};
 