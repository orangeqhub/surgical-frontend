"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessModal({ message, onClose }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      zIndex: 9999,
    });

    const timers = [
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.65 },
          zIndex: 9999,
        });
      }, 150),
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.65 },
          zIndex: 9999,
        });
      }, 150),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="
        fixed inset-0 z-[9998]
        flex items-center justify-center
        bg-black/60
        p-4
      "
    >
      <div
        className="
          w-full max-w-[380px]
          rounded-2xl
          bg-white
          p-8
          text-center
          shadow-xl
          animate-pop-in
        "
      >
        {/* ICON */}
        <div className="mb-4 flex justify-center">
          <div
            className="
              flex h-16 w-16 items-center justify-center
              rounded-full
              bg-green-100
              animate-pop-in-delay
            "
          >
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Payment Successful 🎉
        </h2>

        {/* BACKEND MESSAGE */}
        <p className="mb-6 text-sm text-gray-600">
          {message}
        </p>

        {/* CTA */}
        <button
          onClick={onClose}
          className="
            w-full
            rounded-xl
            bg-[var(--color-text-primary)]
            p-3
            font-semibold
            text-white
            transition-all
            duration-300
            hover:opacity-90
          "
        >
          View Orders
        </button>
      </div>
    </div>
  );
}