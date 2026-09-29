import { Suspense } from "react";

import GoogleCallbackClient from "./GoogleCallbackClient";

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[50vh] items-center justify-center px-4 py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--color-text-primary)]" />
        </section>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}
