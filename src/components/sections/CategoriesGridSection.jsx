"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Tag,
  ArrowRight,
  Package,
  BedDouble,
  Slice,
  Accessibility,
  HandHeart,
  Stethoscope,
  HeartPulse,
  Smile,
  Microscope,
  Pill,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";
import useCategories from "@/hooks/useCategories";
import { getProducts } from "@/services/product.service";
import { useRouter } from "next/navigation";

const CATEGORY_META = [
  {
    keys: ["hospital furniture"],
    icon: BedDouble,
    image: "/categories/hospital-furniture.jpg",
    description:
      "Premium hospital furniture for clinics, hospitals and healthcare facilities.",
  },
  {
    keys: ["surgical & medical consumables", "surgical consumables"],
    icon: Slice,
    image: "/categories/surgical-consumables.jpg",
    description:
      "High-quality surgical instruments, gloves, masks and everyday medical consumables.",
  },
  {
    keys: ["ortho rehab & mobility aids", "ortho rehab", "mobility aids"],
    icon: Accessibility,
    image: "/categories/ortho-rehab.jpg",
    description:
      "Wheelchairs, walkers, crutches and orthopaedic supports for recovery and mobility.",
  },
  {
    keys: ["personal care products"],
    icon: HandHeart,
    image: "/categories/personal-care.jpg",
    description:
      "Personal hygiene and daily care essentials for hospitals, clinics and home use.",
  },
  {
    keys: ["medical devices"],
    icon: Stethoscope,
    image: "/categories/medical-devices.jpg",
    description:
      "BP monitors, pulse oximeters, thermometers and trusted home medical devices.",
  },
  {
    keys: ["diagnostics & monitoring", "diagnostics", "monitoring"],
    icon: HeartPulse,
    image: "/categories/diagnostics.jpg",
    description:
      "Reliable diagnostic and patient monitoring equipment for accurate healthcare results.",
  },
  {
    keys: ["dental care"],
    icon: Smile,
    image: "/categories/dental-care.jpg",
    description:
      "Dental chairs, instruments and professional equipment for modern dental clinics.",
  },
  {
    keys: ["laboratory"],
    icon: Microscope,
    image: "/categories/laboratory.jpg",
    description:
      "Microscopes, test tubes and precision laboratory equipment for scientific work.",
  },
  {
    keys: ["medicines & pharma", "medicines", "pharma"],
    icon: Pill,
    image: "/categories/medicines-pharma.jpg",
    description:
      "Authentic medicines, capsules and pharmaceutical products for every need.",
  },
];

const DEFAULT_CATEGORY_IMAGE = "/categories/default.jpg";

const resolveCategoryMeta = (name) => {
  const normalized = (name || "").toLowerCase().trim();
  if (!normalized) {
    return null;
  }

  const found = CATEGORY_META.find((meta) =>
    meta.keys.some(
      (key) =>
        normalized === key ||
        (key.startsWith(normalized) && normalized.length >= 4) ||
        (normalized.startsWith(key) && key.length >= 4) ||
        normalized.includes(key)
    )
  );

  return found || null;
};

export function CategoriesGridSection() {
  const router = useRouter();
  const { categories, loading, error } = useCategories();

  const [enriched, setEnriched] = useState(null);

  const enriching = enriched === null;

  const enrichedMap = enriched
    ? Object.fromEntries(
        enriched.map((row) => [row.id, row])
      )
    : {};

  useEffect(() => {
    if (!categories || categories.length === 0) {
      return;
    }

    let cancelled = false;

    Promise.all(
      categories.map(async (category) => {
        try {
          const response = await getProducts({
            category_id: category.id,
            page: 1,
            page_size: 1,
          });

          return {
            id: category.id,
            count:
              response?.pagination?.total_records ?? 0,
          };
        } catch (err) {
          return { id: category.id, count: 0 };
        }
      })
    ).then((rows) => {
      if (!cancelled) {
        setEnriched(rows);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [categories]);

  const handleCategoryClick = (item) => {
    sessionStorage.setItem("selectedCategory", item.id);
    router.push("/products");
  };

  return (
    <section className="py-10 md:py-12">
      <Container>
        <div className="mb-8 text-center">
          <Text as="h2" variant="h3" className="text-black">
            Categories
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Browse our full range of products by category
          </Text>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Text>Loading categories...</Text>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <Text className="text-red-500">
              Failed to load categories
            </Text>
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="py-16 text-center">
            <Text className="text-gray-500">
              No categories available
            </Text>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              md:gap-6
              lg:grid-cols-3
              lg:gap-8
            "
          >
            {categories.map((item) => {
              const meta = resolveCategoryMeta(item.name);

              const imageSrc =
                item.image_url ||
                meta?.image ||
                DEFAULT_CATEGORY_IMAGE;

              const description =
                item.description ||
                meta?.description ||
                `High-quality ${item.name} products for hospitals, clinics and home healthcare.`;

              const CategoryIcon =
                meta?.icon || Tag;

              return (
                <div
                  key={item.id}
                  onClick={() => handleCategoryClick(item)}
                  className="group relative cursor-pointer rounded-2xl [perspective:1400px]"
                >
                  <div className="relative h-full w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front */}
                    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:border-[var(--color-text-primary)] group-hover:shadow-xl [backface-visibility:hidden]">
                      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-52 md:h-56 lg:h-64">
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            size={15}
                            className="shrink-0 text-[var(--color-text-primary)]"
                          />

                          <Text
                            variant="body"
                            className="
                              font-semibold
                              text-gray-900
                              leading-snug
                              line-clamp-2
                            "
                          >
                            {item.name}
                          </Text>
                        </div>

                        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray-500 line-clamp-3">
                          {description}
                        </p>

                        <div className="mt-auto pt-3.5">
                          {enriching ? (
                            <span className="block h-3.5 w-16 animate-pulse rounded bg-gray-200" />
                          ) : (
                            <Text
                              variant="bodySmall"
                              className="
                                font-medium
                                text-gray-500
                              "
                            >
                              {enrichedMap[item.id]?.count ?? 0}{" "}
                              {enrichedMap[item.id]?.count === 1
                                ? "product"
                                : "products"}
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 group-hover:border-[var(--color-text-primary)] group-hover:shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        aria-hidden="true"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/95" />

                      <div className="relative flex h-full flex-col items-center justify-center gap-2.5 px-5 py-6 text-center sm:px-6">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-text-primary)]/15 bg-white/90 shadow-sm">
                          <CategoryIcon
                            size={21}
                            className="text-[var(--color-text-primary)]"
                          />
                        </span>

                        <p className="text-base font-bold leading-snug text-gray-900 line-clamp-2 sm:text-[17px]">
                          {item.name}
                        </p>

                        <p className="max-w-[280px] text-xs leading-relaxed text-gray-600 line-clamp-3 sm:text-[13px]">
                          {description}
                        </p>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-text-primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--color-text-primary)]">
                          {enriching ? (
                            <span className="h-3.5 w-16 animate-pulse rounded-full bg-gray-200" />
                          ) : (
                            <>
                              <Package size={13} />
                              {enrichedMap[item.id]?.count ?? 0}{" "}
                              {enrichedMap[item.id]?.count === 1
                                ? "product"
                                : "products"}
                            </>
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(item);
                          }}
                          className="
                            mt-1
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-[var(--color-text-primary)]
                            px-7
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-indigo-600/20
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:shadow-xl
                            hover:brightness-110
                            active:scale-95
                          "
                        >
                          View Products
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(item);
                          }}
                          className="
                            mt-1
                            inline-flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-[var(--color-text-primary)]
                            transition-colors
                            hover:underline
                          "
                        >
                          Explore Category
                          <ArrowRight
                            size={13}
                            className="transition-transform duration-200 hover:translate-x-0.5"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}