"use client";
import Text from "@/components/ui/Text";
import useCategories from "@/hooks/useCategories";
export default function FilterSidebar({
  selectedCategory = "",
  onCategoryChange,
}) {
  const { categories, loading } =
    useCategories();

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <Text
        variant="h4"
        className="mb-5 font-semibold text-black"
      >
        Categories
      </Text>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="h-5 w-full animate-pulse rounded bg-gray-100"
              />
            )
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() =>
              onCategoryChange("")
            }
            className={`block w-full text-left text-sm transition-colors ${
              selectedCategory === ""
                ? "font-semibold text-[var(--color-text-primary)]"
                : "text-gray-600"
            }`}
          >
            All Categories
          </button>

          {categories?.map(
            (category) => (
              <button
                key={category.id}
                onClick={() =>
                  onCategoryChange(
                    category.id
                  )
                }
                className={`block w-full text-left text-sm transition-colors cursor-pointer ${
                  selectedCategory ===
                  category.id
                    ? "font-semibold text-[var(--color-text-primary)]"
                    : "text-gray-600"
                }`}
              >
                {category.name}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}