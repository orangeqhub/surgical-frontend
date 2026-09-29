"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, User, Search, Plus, Menu } from "lucide-react";
import clsx from "clsx";
import Container from "./Container";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300",
        scrolled && "shadow-lg"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-20">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Plus size={22} />
            </button>
            <h1 className="text-xl font-bold text-blue-600 lg:text-3xl">
              SURGICAL WORLD
            </h1>
          </div>

          <div className="mx-8 hidden max-w-3xl flex-1 md:flex">
            <div className="flex w-full overflow-hidden rounded-xl border border-gray-300">
              <input
                type="text"
                placeholder="Search surgical instruments..."
                className="h-12 flex-1 px-5 outline-none"
              />
              <button className="flex w-16 items-center justify-center bg-blue-600 text-white">
                <Search size={22} />
              </button>
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <button className="relative">
              <Heart size={28} />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                2
              </span>
            </button>
            <button className="relative">
              <ShoppingCart size={28} />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                1
              </span>
            </button>
            <button>
              <User size={28} />
            </button>
          </div>

          <button className="md:hidden">
            <Menu size={28} />
          </button>
        </div>
      </Container>

      <div className="hidden border-t md:block">
        <Container>
          <nav className="flex h-14 items-center gap-10">
            <a href="/" className="font-medium text-blue-600">
              Home
            </a>
            <a href="/shop">Shop</a>
            <a href="/categories">Categories</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </Container>
      </div>
    </header>
  );
}