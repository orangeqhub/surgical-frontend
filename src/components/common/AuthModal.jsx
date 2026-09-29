

"use client";

import { useState } from "react";
import { X, User, Mail, Lock } from "lucide-react";
import useLogin from "@/hooks/useLogin";
import useRegister from "@/hooks/useRegister";
import { useDispatch } from "react-redux";
import useCart from "@/hooks/useCart";
import { getGoogleLoginUrl } from "@/services/auth.service";
import {
  persistAuthSession,
  sanitizeReturnTo,
} from "@/utils/authSession";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const { syncGuestCart } = useCart(); // ✅ DESTRUCTURED SYNC FUNCTION

  const [activeTab, setActiveTab] = useState("login");
const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");

// ADD THESE
const [phoneError, setPhoneError] = useState("");
const [passwordError, setPasswordError] = useState("");

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [googleError, setGoogleError] = useState("");
const [googleLoading, setGoogleLoading] = useState(false);

    const {
        register,
        loading: registerLoading,
        success,
        error: registerError,
    } = useRegister();

    const { login, loading, error } = useLogin();

    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        setGoogleError("");

        const currentQuery = new URLSearchParams(window.location.search);
        const returnTo = currentQuery.get("auth") === "checkout"
            ? "/checkout"
            : sanitizeReturnTo(
                `${window.location.pathname}${window.location.search}`
            );
        const loginUrl = getGoogleLoginUrl(returnTo);

        if (!loginUrl) {
            setGoogleError("Google login is not configured.");
            return;
        }

        setGoogleLoading(true);
        window.location.assign(loginUrl);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setPhoneError("");
        setPasswordError("");

        // Mobile validation
        if (!/^[0-9]{10}$/.test(phone)) {
            setPhoneError("Mobile number must be exactly 10 digits");
            return;
        }

        // Password validation
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!passwordRegex.test(signupPassword)) {
            setPasswordError(
                "Password must contain at least 8 characters, 1 uppercase letter and 1 special character"
            );
            return;
        }

        try {
            const response = await register({
                full_name: fullName,
                email: signupEmail,
                phone,
                password: signupPassword,
            });

            if (response.success) {
                setActiveTab("login");
                setFullName("");
                setPhone("");
                setSignupEmail("");
                setSignupPassword("");
                setPhoneError("");
                setPasswordError("");
            }
        } catch {
            return;
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({
                email,
                password,
            });

            const token =
                response?.data?.access_token ||
                response?.data?.data?.token ||
                response?.token;

            const user =
                response?.data?.user ||
                response?.user;

            if (!token) {
                return;
            }

            persistAuthSession({ token, user }, dispatch);

            // ✅ SYNC THE GUEST CART TO BACKEND NOW THAT WE HAVE A TOKEN
            await syncGuestCart();

            // close modal
            onClose();

            // success (This triggers the redirect to checkout in AuthHandler)
            if (onSuccess) {
                onSuccess();
            }
        } catch {
            return;
        }
    };

    return (
        // ... Keep the exact same JSX return block you already have ...
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[var(--color-text-primary)] to-blue-500 px-5 py-6 text-center">
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 text-white transition hover:bg-white/30"
                    >
                        <X size={16} />
                    </button>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--color-text-primary)]">
                        <User size={22} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Welcome</h2>
                    <p className="mt-1 text-xs text-blue-100">Login or create an account</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => { setGoogleError(""); setActiveTab("login"); }}
                        className={`flex-1 py-3 text-sm font-medium transition ${activeTab === "login"
                            ? "border-b-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)]"
                            : "text-gray-500"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setGoogleError(""); setActiveTab("signup"); }}
                        className={`flex-1 py-3 text-sm font-medium transition ${activeTab === "signup"
                            ? "border-b-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)]"
                            : "text-gray-500"
                            }`}
                    >
                        Create Account
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    {activeTab === "login" ? (
                        <form onSubmit={handleLogin} className="space-y-3">
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none"
                                    required
                                />
                            </div>
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-10 w-full rounded-lg bg-[var(--color-text-primary)] text-sm font-medium text-white"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-3">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                                className="h-10 w-full rounded-lg border px-3 text-sm"
                                required
                            />
                            <div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");

                                        if (value.length <= 10) {
                                            setPhone(value);
                                        }

                                        if (value.length > 0 && value.length !== 10) {
                                            setPhoneError("Mobile number must be exactly 10 digits");
                                        } else {
                                            setPhoneError("");
                                        }
                                    }}
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    className={`h-10 w-full rounded-lg border px-3 text-sm ${phoneError ? "border-red-500" : ""
                                        }`}
                                    required
                                />

                                {phoneError && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {phoneError}
                                    </p>
                                )}
                            </div>
                            <input
                                type="email"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                placeholder="Email Address"
                                className="h-10 w-full rounded-lg border px-3 text-sm"
                                required
                            />
                            <div>
                                <input
                                    type="password"
                                    value={signupPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSignupPassword(value);

                                        const passwordRegex =
                                            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

                                        if (value.length > 0 && !passwordRegex.test(value)) {
                                            setPasswordError(
                                                "Password must be at least 8 characters, contain 1 uppercase letter and 1 special character"
                                            );
                                        } else {
                                            setPasswordError("");
                                        }
                                    }}
                                    placeholder="Password"
                                    className={`h-10 w-full rounded-lg border px-3 text-sm ${passwordError ? "border-red-500" : ""
                                        }`}
                                    required
                                />

                                {passwordError && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {passwordError}
                                    </p>
                                )}
                            </div>
                            {success && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-2 text-xs text-green-700">
                                    {success}
                                </div>
                            )}
                            {registerError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                                    {registerError}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={
                                    registerLoading ||
                                    phone.length !== 10 ||
                                    passwordError
                                }
                                className="h-10 w-full rounded-lg bg-[var(--color-text-primary)] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {registerLoading ? "Creating..." : "Create Account"}
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="my-4 flex items-center">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="px-3 text-xs text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {googleError && (
                        <p className="mb-2 text-xs text-red-500">{googleError}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-[#dadce0] bg-white px-4 text-sm font-medium tracking-[0.25px] text-[#3c4043] shadow-[0_1px_2px_rgba(60,64,67,0.15)] transition duration-150 hover:bg-[#f8fafd] hover:border-[#dadce0] hover:shadow-[0_1px_3px_rgba(60,64,67,0.3)] active:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg className="h-[18px] w-[18px] flex-shrink-0" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>
                            {googleLoading
                                ? "Redirecting..."
                                : activeTab === "signup"
                                    ? "Sign up with Google"
                                    : "Sign in with Google"}
                        </span>
                    </button>

                    {/* Footer */}
                    <p className="mt-4 text-center text-xs text-gray-500">
                        {activeTab === "login" ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => { setGoogleError(""); setActiveTab(activeTab === "login" ? "signup" : "login"); }}
                            className="ml-1 font-medium text-[var(--color-text-primary)]"
                        >
                            {activeTab === "login" ? "Create Account" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}


