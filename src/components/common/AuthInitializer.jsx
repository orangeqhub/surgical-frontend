"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/redux/userSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      if (storedUser) {
        localStorage.removeItem("user");
      }
      dispatch(clearUser());
      return;
    }

    if (!storedUser) return;

    try {
      dispatch(setUser(JSON.parse(storedUser)));
    } catch {
      localStorage.removeItem("user");
      dispatch(clearUser());
    }
  }, [dispatch]);

  return null;
}



