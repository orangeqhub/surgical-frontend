

import { Suspense } from "react";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

import { AuthInitializer, Header, Footer } from "@/components";
import AuthHandler from "@/components/common/Authhandler";
import ReduxProvider from "@/providers/ReduxProvider";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "SURGICAL WORLD",
  description: "Trusted Medical Equipment Store",
  icons: {
    icon: "/surgicallogo3.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: "no",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden font-sans bg-white">
        <ReduxProvider>
          <AuthInitializer />

          <Suspense fallback={null}>
            <AuthHandler>
              <Header />

              <main className="flex-1 pt-24 md:pt-24 lg:pt-[120px]">
                {children}
              </main>

              <Footer />
            </AuthHandler>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}