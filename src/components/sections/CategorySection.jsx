"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";
import useCategories from "@/hooks/useCategories";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  HeartPulse,
  Pill,
  Thermometer,
  Accessibility,
  Bed,
  ShieldPlus,
  Syringe,
  Microscope,
  Scissors,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AUTO_SCROLL_SPEED = 80;
const AUTO_SCROLL_CLONES = 3;

const categoryIcons = {
  Diagnostics: Microscope,
  Nebulizers: HeartPulse,
  "BP Monitors": Stethoscope,
  Aids: Accessibility,
  "Gloves & PPE": ShieldPlus,
  Wheelchairs: Accessibility,
  Surgical: Syringe,
  "OT Equipment": Scissors,
  Thermometers: Thermometer,
  Medicines: Pill,
  Furniture: Bed,
};

export default function CategorySection() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);

  const { categories, loading, error } = useCategories();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || loading || error || !categories || categories.length === 0) {
      return;
    }

    const copyWidth = el.scrollWidth / AUTO_SCROLL_CLONES;
    if (copyWidth <= el.clientWidth + 1) {
      return;
    }

    el.style.scrollBehavior = "auto";

    const step = (time) => {
      if (pausedRef.current) {
        lastTimeRef.current = time;
      } else {
        if (lastTimeRef.current == null) {
          lastTimeRef.current = time;
        }

        const dt = Math.min(
          (time - lastTimeRef.current) / 1000,
          0.1
        );
        lastTimeRef.current = time;

        let next =
          el.scrollLeft + AUTO_SCROLL_SPEED * dt;

        if (next >= copyWidth) {
          next %= copyWidth;
        }

        if (next < 0) {
          next += copyWidth;
        }

        el.scrollLeft = next;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.style.scrollBehavior = "";
      lastTimeRef.current = null;
    };
  }, [categories, loading, error]);

  const handleCategoryClick = (item) => {
    sessionStorage.setItem("selectedCategory", item.id);
    router.push("/products");
  };

  const scrollCategories = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-12">
        <Container>
          <Text>Loading categories...</Text>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <Container>
          <Text className="text-red-500">
            Failed to load categories
          </Text>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-12">
      <Container>
        <div className="mb-6 text-center">
          <Text
            as="h2"
            variant="h3"
            className="text-black"
          >
            Shop by Category
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Find exactly what you need
          </Text>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollCategories("left")}
            className="
              absolute
              left-0
              top-1/2
              z-10
              hidden
              -translate-y-1/2
              rounded-full
              bg-white
              p-3
              shadow-lg
              hover:bg-gray-100
              lg:flex
            "
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollCategories("right")}
            className="
              absolute
              right-0
              top-1/2
              z-10
              hidden
              -translate-y-1/2
              rounded-full
              bg-white
              p-3
              shadow-lg
              hover:bg-gray-100
              lg:flex
            "
          >
            <ChevronRight size={22} />
          </button>

          <div
            ref={scrollRef}
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
            className="
              flex
              gap-4
              overflow-x-auto
              scroll-smooth
              pb-3
              scrollbar-hide
              lg:px-14
            "
          >
            {Array.from({ length: AUTO_SCROLL_CLONES })
              .flatMap((_, copyIndex) =>
                categories.map((item) => {
                  const Icon =
                    categoryIcons[item.name] || Microscope;

                  return (
                    <div
                      key={`${item.id}-${copyIndex}`}
                      onClick={() =>
                        handleCategoryClick(item)
                      }
                      className="
                        group
                        min-w-[130px]
                        sm:min-w-[150px]
                        md:min-w-[170px]
                        lg:min-w-[180px]
                        flex-shrink-0
                        cursor-pointer
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-3
                        transition-all
                        duration-300
                        hover:border-[var(--color-text-primary)]
                        hover:shadow-lg
                      "
                    >
                      <div
                        className="
                          h-[76px]
                          w-[76px]
                          rounded-full
                          flex
                          items-center
                          justify-center
                          bg-blue-50
                        "
                      >
                        <div
                          className="
                            h-[76px]
                            w-[76px]
                            rounded-full
                            flex
                            items-center
                            justify-center
                            bg-blue-50
                            text-[22px]
                          "
                        >
                          {item.icon || (
                            <Icon
                              size={34}
                              className="text-[var(--color-text-primary)]"
                            />
                          )}
                        </div>
                      </div>

                      <Text
                        variant="bodySmall"
                        className="
                          text-center
                          font-medium
                          text-black
                          line-clamp-2
                        "
                      >
                        {item.name}
                      </Text>
                    </div>
                  );
                })
              )}
          </div>
        </div>
      </Container>
    </section>
  );
}