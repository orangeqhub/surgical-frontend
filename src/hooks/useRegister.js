import { useState } from "react";
import { registerService } from "@/services/auth.service";

export default function useRegister() {
  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const register = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response =
        await registerService(data);
      if (response.success) {
        setSuccess(response.message);
      }
      return response;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    register,
    loading,
    success,
    error,
  };
}