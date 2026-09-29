import { useState } from "react";
import { loginService } from "@/services/auth.service";

export default function useLogin() {
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const login = async (data) => {
    try {
      setLoading(true);
      setError("");
      const response =
        await loginService(data);
      return response;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}