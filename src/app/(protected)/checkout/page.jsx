

"use client";

import { useEffect, useState } from "react";

import {
  Container,
  CheckoutForm,
  CheckoutSteps,
  AuthModal,
} from "@/components";

export default function CheckoutPage() {
  const [showLogin, setShowLogin] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {
    const user =
      localStorage.getItem("user");

    if (!user) {
      setShowLogin(true);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  // =========================
  // LOGIN SUCCESS
  // =========================
  const handleLoginSuccess = () => {
    setShowLogin(false);

    setIsLoggedIn(true);
  };

  return (
    <>
      {/* LOGIN MODAL */}
      <AuthModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* CHECKOUT CONTENT */}
      {isLoggedIn && (
        <section className="bg-gray-50 py-10">
          <Container>
            <div className="mx-auto max-w-4xl">

              <CheckoutSteps
                currentStep={2}
              />

              <CheckoutForm />

            </div>
          </Container>
        </section>
      )}
    </>
  );
}

