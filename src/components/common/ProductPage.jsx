"use client";

import { useEffect, useState } from "react";
import {
  Text,
  FilterSidebar,
  ProductGrid,
  Container,
} from "@/components";

import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function ProductsPage({
  pageTitle = "Products",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [categoryId, setCategoryId] = useState("");

  

  const { categories } = useCategories();

  const {
    products,
    loading,
    pagination,
    fetchProducts,
  } = useProducts();

  // Fetch Products
const search = searchParams.get("search") || "";

useEffect(() => {
  console.log("Search:", search);

  fetchProducts({
    page: currentPage,
    page_size: 12,
    category_id: categoryId,
    search,
  });
}, [currentPage, categoryId, search]);

  // Load category from session
  useEffect(() => {
    const category = sessionStorage.getItem("selectedCategory");

    if (category) {
      setCategoryId(category);
      sessionStorage.removeItem("selectedCategory");
    }
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    setCurrentPage(1);

    if (search) {
      router.push(
        `/products?search=${encodeURIComponent(search)}`
      );
    } else {
      router.push("/products");
    }
  };

  return (
    <section className="py-6 md:py-8">
         <Container className="max-w-[1600px]">
        <div className="mb-5">
          <Text variant="h4" className="text-black">
            {pageTitle}
          </Text>

          {search && (
            <Text
              variant="body"
              className="mt-2 text-gray-500"
            >
              Search results for: <b>{search}</b>
            </Text>
          )}
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden w-[280px] shrink-0 md:block">
            <FilterSidebar
              selectedCategory={categoryId}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <div className="min-w-0 flex-1">
            {/* Mobile Category */}
            <div className="mb-4 md:hidden">
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 font-medium text-black outline-none"
              >
                <option value="">All Categories</option>

                {categories?.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Count */}
            <div className="mb-5">
              <Text
                variant="body"
                className="font-medium text-black"
              >
                Showing {products?.length || 0} of{" "}
                {pagination?.total_records || 0} products
              </Text>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="py-20 text-center">
                <Text>Loading...</Text>
              </div>
            ) : products?.length > 0 ? (
              <>
                <ProductGrid products={products} />

                {pagination?.total_pages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => prev - 1)
                      }
                      className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {[...Array(pagination.total_pages)].map(
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setCurrentPage(index + 1)
                          }
                          className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                            currentPage === index + 1
                              ? "bg-[var(--color-text-primary)] text-white"
                              : "border bg-white"
                          }`}
                        >
                          {index + 1}
                        </button>
                      )
                    )}

                    <button
                      disabled={
                        currentPage ===
                        pagination.total_pages
                      }
                      onClick={() =>
                        setCurrentPage((prev) => prev + 1)
                      }
                      className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
                <Text
                  variant="h5"
                  className="mb-2"
                >
                  No Products Found
                </Text>

                <Text className="text-gray-500">
                  No products found
                  {search ? ` for "${search}"` : "."}
                </Text>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}