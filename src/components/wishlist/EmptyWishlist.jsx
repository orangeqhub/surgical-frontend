"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";

export default function EmptyState({
  title = "Your cart is empty",
  description = "Browse our bestsellers and add your favourites.",
  buttonText = "Start Shopping",
  buttonLink = "/products",
}) {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}

          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <ShoppingCart
                size={48}
                className="text-slate-400"
              />
            </div>
          </div>

          {/* Title */}

          <Text
            variant="h2"
            className="mb-4 font-semibold text-slate-900"
          >
            {title}
          </Text>

          {/* Description */}

          <Text
            variant="body"
            className="mx-auto max-w-md text-slate-500"
          >
            {description}
          </Text>

          {/* Button */}

          <div className="mt-10">
            <Link
              href={buttonLink}
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-cyan-700
                px-8
                py-4
                text-lg
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-cyan-800
                hover:shadow-lg
              "
            >
              {buttonText}
              →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}