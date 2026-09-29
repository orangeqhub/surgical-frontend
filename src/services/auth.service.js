import Cookies from "js-cookie";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/endpoints";

const googleOAuthBindingCookie = "google_oauth_binding";

const getSecureCookieOption = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const getOAuthBinding = () => {
  if (
    typeof window === "undefined" ||
    !window.crypto?.getRandomValues
  ) {
    return null;
  }

  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};

export const getGoogleOAuthBinding = () =>
  Cookies.get(googleOAuthBindingCookie);

export const clearGoogleOAuthBinding = () =>
  Cookies.remove(googleOAuthBindingCookie, {
    path: "/auth/google/callback",
  });

export const registerService = async (
  payload
) => {
  const response = await api.post(
    API_ENDPOINTS.REGISTER,
    payload
  );

  return response.data;
};
export const loginService = async (
  payload
) => {
  const response = await api.post(
    API_ENDPOINTS.LOGIN,
    payload
  );
  const result = response.data;
  if (result.success) {
    Cookies.set(
      "token",
      result.data.access_token,
      {
        expires: 7,
        sameSite: "Strict",
        secure: getSecureCookieOption(),
        path: "/",
      }
    );
    Cookies.set(
      "user",
      JSON.stringify(result.data.user),
      {
        expires: 7,
        sameSite: "Strict",
        secure: getSecureCookieOption(),
        path: "/",
      }
    );
  }

  return result;
};
export const googleLoginService = async (
  idToken
) => {
  const response = await api.post(
    API_ENDPOINTS.GOOGLE_LOGIN,
    { id_token: idToken }
  );
  const result = response.data;
  if (result.success) {
    Cookies.set(
      "token",
      result.data.access_token,
      {
        expires: 7,
        sameSite: "Strict",
        secure: getSecureCookieOption(),
        path: "/",
      }
    );
    Cookies.set(
      "user",
      JSON.stringify(result.data.user),
      {
        expires: 7,
        sameSite: "Strict",
        secure: getSecureCookieOption(),
        path: "/",
      }
    );
  }

  return result;
};

export const getGoogleLoginUrl = (returnTo = "/") => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const binding = getOAuthBinding();

  if (!apiUrl || !binding) {
    return null;
  }

  try {
    const url = new URL(
      API_ENDPOINTS.GOOGLE_OAUTH_LOGIN,
      apiUrl
    );
    url.searchParams.set("return_to", returnTo);
    url.searchParams.set("binding", binding);

    Cookies.set(
      googleOAuthBindingCookie,
      binding,
      {
        expires: 10,
        sameSite: "Strict",
        secure: getSecureCookieOption(),
        path: "/auth/google/callback",
      }
    );

    return url.toString();
  } catch {
    return null;
  }
};

export const exchangeGoogleCode = async (
  code,
  binding
) => {
  const response = await api.post(
    API_ENDPOINTS.GOOGLE_OAUTH_EXCHANGE,
    { code, binding }
  );
  const result = response.data;
  if (result.success && result.data?.access_token) {
    Cookies.set(
      "token",
      result.data.access_token,
      {
        expires: 7,
        sameSite: "Strict",
        secure: getSecureCookieOption(),
        path: "/",
      }
    );
    Cookies.set(
      "user",
      JSON.stringify(result.data.user),
      {
        expires: 7,
        sameSite: "Strict",
        secure: getSecureCookieOption(),
        path: "/",
      }
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("token", result.data.access_token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
    }
  }

  return result;
};

export const logoutService = () => {
  Cookies.remove("token");
  Cookies.remove("user");

  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  if (api?.defaults?.headers?.common) {
    delete api.defaults.headers.common["Authorization"];
  }
};