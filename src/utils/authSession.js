import Cookies from "js-cookie";
import api from "@/lib/axios";
import { setUser } from "@/redux/userSlice";

const sessionCookieOptions = {
  expires: 7,
  sameSite: "Strict",
  secure:
    typeof window !== "undefined" &&
    window.location.protocol === "https:",
  path: "/",
};

export const persistAuthSession = ({ token, user }, dispatch) => {
  if (!token || !user || typeof dispatch !== "function") {
    throw new Error("Invalid authentication response");
  }

  Cookies.set("token", token, sessionCookieOptions);
  Cookies.set("user", JSON.stringify(user), sessionCookieOptions);
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
  if (api?.defaults?.headers?.common) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  dispatch(setUser(user));
};

export const sanitizeReturnTo = (value) => {
  if (typeof value !== "string") {
    return "/";
  }

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    [...value].some((character) => character.charCodeAt(0) < 32)
  ) {
    return "/";
  }

  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) {
      return "/";
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return "/";
  }
};
