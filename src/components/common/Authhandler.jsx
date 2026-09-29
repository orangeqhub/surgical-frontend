"use client";
 
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthModal } from "..";
 
export default function AuthHandler({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
 
  // get auth query
  const authRedirect = searchParams.get("auth");
 
  useEffect(() => {
    // open login modal
    if (authRedirect === "checkout") {
      setShowLogin(true);
    }
  }, [authRedirect]);
 
  // after successful login
  const handleLoginSuccess = () => {
    setShowLogin(false);
    // Redirect cleanly to checkout
    router.push("/checkout");
  };
 
  // close modal
  const handleClose = () => {
    setShowLogin(false);
    router.replace("/");
  };
 
  return (
    <>
      {children}
      <AuthModal
        isOpen={showLogin}
        onClose={handleClose}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
 