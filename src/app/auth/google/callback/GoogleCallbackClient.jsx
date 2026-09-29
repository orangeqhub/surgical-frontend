"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import useCart from "@/hooks/useCart";
import {
  clearGoogleOAuthBinding,
  exchangeGoogleCode,
  getGoogleOAuthBinding,
} from "@/services/auth.service";
import {
  persistAuthSession,
  sanitizeReturnTo,
} from "@/utils/authSession";

export default function GoogleCallbackClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncGuestCart } = useCart();
  const syncGuestCartRef = useRef(syncGuestCart);
  const loginPromiseRef = useRef(null);
  const [requestError, setRequestError] = useState("");

  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const returnTo = searchParams.get("return_to");

  useEffect(() => {
    syncGuestCartRef.current = syncGuestCart;
  }, [syncGuestCart]);

  useEffect(() => {
    const exchangeKey = code || oauthError || "missing";

    if (oauthError || !code) {
      return;
    }

    const completeLogin = async () => {
      const binding = getGoogleOAuthBinding();

      if (!binding) {
        throw new Error("Google sign-in session is missing.");
      }

      const response = await exchangeGoogleCode(
        code,
        binding
      );
      clearGoogleOAuthBinding();
      const token = response?.data?.access_token;
      const user = response?.data?.user;

      persistAuthSession({ token, user }, dispatch);
      await syncGuestCartRef.current();
      router.replace(sanitizeReturnTo(returnTo));
    };

    if (
      !loginPromiseRef.current ||
      loginPromiseRef.current.key !== exchangeKey
    ) {
      loginPromiseRef.current = {
        key: exchangeKey,
        promise: completeLogin(),
      };
    }

    loginPromiseRef.current.promise.catch((error) => {
      setRequestError(
        error?.response?.data?.message ||
          "Google sign-in could not be completed."
      );
    });
  }, [code, dispatch, oauthError, returnTo, router]);

  const queryError = oauthError
    ? oauthError === "access_denied"
      ? "Google sign-in was cancelled."
      : "Google sign-in could not be completed."
    : !code
      ? "Google sign-in could not be completed."
      : "";
  const error = requestError || queryError;

  return (
    <section className="flex min-h-[50vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-gray-900">
              Google sign-in unsuccessful
            </h1>
            <p className="mt-3 text-sm text-gray-600">{error}</p>
            <Link
              href="/"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-text-primary)] px-5 text-sm font-medium text-white"
            >
              Return to home
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-900">
              Completing Google sign-in
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Please wait while we securely finish your login.
            </p>
            <div className="mx-auto mt-6 h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--color-text-primary)]" />
          </>
        )}
      </div>
    </section>
  );
}
