



"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

import { Container, Text, Button, AuthModal } from "@/components";
import useCart from "@/hooks/useCart";
import useProductDetails from "@/hooks/useProductDetails";
import { useSelector } from "react-redux";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Track selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  const user = useSelector((state) => state.user?.user);

  const { product, loading, fetchProduct } = useProductDetails();
  const { addCart } = useCart();

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  // Set default variant when product data loads
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  const images =
    product?.images?.length > 0
      ? product.images
      : [{ image_url: product?.thumbnail_url }];

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  // ================= ACTIVE DATA (VARIANT OR PRODUCT) =================
  const currentSalePrice = selectedVariant ? selectedVariant.sale_price : product?.sale_price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product?.mrp;
  const currentStockStatus = selectedVariant ? selectedVariant.stock_status : product?.stock_status;
  const currentStockQty = selectedVariant ? selectedVariant.available_stock ?? selectedVariant.stock_qty : product?.stock_qty;
  const currentSku = selectedVariant ? selectedVariant.sku : product?.sku;
  const currentColor = selectedVariant?.color || product?.color;

  // ================= STOCK LOGIC =================
  const isOutOfStock =
    currentStockStatus?.toLowerCase() === "out of stock" ||
    Number(currentStockQty) <= 0;

  // ================= STRICT VALIDATION (HIDES MISSING, EMPTY & 0) =================
  const isValid = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (val === 0 || val === "0" || Number(val) === 0) return false;
    return true;
  };

  // ================= UNIQUE COLORS & SIZES LIST =================
  const availableColors = useMemo(() => {
    if (!product?.variants?.length) return [];
    return Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product?.variants?.length) return [];
    return Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
  }, [product]);

  // Handler to match variant when Color or Size changes
  const handleSelectAttribute = (type, value) => {
    if (!product?.variants?.length) return;

    let matched = null;
    if (type === "color") {
      matched = product.variants.find(
        (v) => v.color === value && v.size === selectedVariant?.size
      ) || product.variants.find((v) => v.color === value);
    } else if (type === "size") {
      matched = product.variants.find(
        (v) => v.size === value && v.color === selectedVariant?.color
      ) || product.variants.find((v) => v.size === value);
    }

    if (matched) {
      setSelectedVariant(matched);
    }
  };

  // ================= PRODUCT INFO ITEMS =================
  const infoFields = [
    { label: "SKU", value: isValid(currentSku) ? currentSku : null },
    { label: "Color", value: isValid(currentColor) ? currentColor : null },
    { label: "Manufacturer", value: isValid(product?.manufacturer) ? product.manufacturer : null },
    { label: "HSN Code", value: isValid(product?.hsn_code) ? product.hsn_code : null },
    { label: "Stock Qty", value: isValid(currentStockQty) ? currentStockQty : null },
    { label: "Weight", value: isValid(product?.weight) ? `${product.weight} kg` : null },
    { label: "Length", value: isValid(product?.length) ? `${product.length} cm` : null },
    { label: "Breadth", value: isValid(product?.breadth) ? `${product.breadth} cm` : null },
    { label: "Height", value: isValid(product?.height) ? `${product.height} cm` : null },
    { label: "Status", value: isValid(product?.status) ? product.status : null, fullWidth: true },
  ].filter((item) => item.value !== null);

  const handleBuyNow = async () => {
    if (isOutOfStock) return;

    try {
      setAdding(true);

      const productId = product?.id || product?.product_id;

      const activeVariant =
        selectedVariant ||
        (product?.variants?.length > 0 ? product.variants[0] : null);

      const variantId = activeVariant?.id || activeVariant?.variant_id || product?.variant_id || null;

      const productPayload = {
        ...product,
        sale_price: currentSalePrice,
        mrp: currentMrp,
        selected_variant: activeVariant,
      };

      const res = await addCart(productId, 1, productPayload, variantId);

      if (res?.success) {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }

  const reviewBlock = product?.reviews?.[0];
  const ratingSummary = reviewBlock?.rating_summary;

  return (
    <section className="py-6 md:py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ================= IMAGE SLIDER ================= */}
          <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="relative h-[320px] md:h-[500px] flex items-center justify-center">
              <Image
                src={images[currentImageIndex]?.image_url}
                alt={product.name || "Product"}
                fill
                className="object-contain p-4 transition-all duration-500"
              />
            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div>
            {(() => {
              const categoryValues =
                Array.isArray(product?.categories) &&
                product.categories.length > 0
                  ? product.categories
                  : product?.category
                    ? [product.category]
                    : [];

              const categoryNames = categoryValues
                .map((category) =>
                  typeof category === "string"
                    ? category
                    : category?.name
                )
                .filter(Boolean);

              if (categoryNames.length === 0) return null;

              return (
                <div className="flex flex-wrap gap-2">
                  {categoryNames.map((name, index) => (
                    <span
                      key={`${name}-${index}`}
                      className="text-sm text-green-600 font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              );
            })()}

            <Text variant="h2">{product.name}</Text>

            {isValid(product?.brand) && (
              <p className="text-gray-500 mt-1">Brand: {product.brand}</p>
            )}

            {/* PRICE */}
            <div className="flex gap-3 items-center my-4">
              {isValid(currentSalePrice) && (
                <span className="text-3xl font-bold text-green-600">
                  ₹{Number(currentSalePrice).toLocaleString("en-IN")}
                </span>
              )}

              {isValid(currentMrp) && Number(currentMrp) > Number(currentSalePrice) && (
                <span className="line-through text-gray-400">
                  ₹{Number(currentMrp).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* ================= SIZE SELECTION ================= */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Select Size:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedVariant?.size || "N/A"}
                  </span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedVariant?.size === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSelectAttribute("size", sz)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          isSelected
                            ? "border-green-600 bg-green-50 text-green-700 font-semibold"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= STOCK BADGE ================= */}
            <div className="mb-3">
              {isOutOfStock ? (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              ) : (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {currentStockStatus || "In Stock"}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            {isValid(product?.short_description) && (
              <p className="mt-4 text-gray-600">
                {product.short_description}
              </p>
            )}

            {isValid(product?.description) && (
              <p className="mt-2 text-gray-600">{product.description}</p>
            )}

            {/* ================= BUY BUTTON ================= */}
            <Button
              className="w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleBuyNow}
              disabled={adding || isOutOfStock}
            >
              {isOutOfStock
                ? "Out of Stock"
                : adding
                ? "Processing..."
                : "Buy Now"}
            </Button>

            {/* ================= PRODUCT INFO ================= */}
            {infoFields.length > 0 && (
              <div className="mt-8 border rounded-2xl p-5 bg-white">
                <h2 className="text-xl font-bold mb-4">Product Information</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {infoFields.map((field) => (
                    <div
                      key={field.label}
                      className={`p-3 bg-gray-50 rounded-xl ${
                        field.fullWidth ? "col-span-2" : ""
                      }`}
                    >
                      <p className="text-gray-500">{field.label}</p>
                      <p className="font-semibold">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= REVIEWS ================= */}
            <div className="mt-8 border rounded-2xl p-5 bg-white">
              <h2 className="text-xl font-bold mb-4">Ratings & Reviews</h2>

              {/* AVG RATING */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-green-600">
                  {ratingSummary?.average_rating || product.rating || 0}
                </div>

                <div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i <
                          Math.round(
                            ratingSummary?.average_rating || product.rating || 0
                          )
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-500">
                    {ratingSummary?.total_reviews || product.review_count || 0}{" "}
                    Reviews
                  </p>
                </div>
              </div>

              {/* REVIEWS LIST */}
              <div className="space-y-4 max-h-[280px] overflow-y-auto">
                {reviewBlock?.reviews?.length ? (
                  reviewBlock.reviews.map((r) => (
                    <div key={r.id} className="border rounded-xl p-3">
                      <div className="flex justify-between">
                        <p className="font-semibold">{r.user?.name}</p>
                        <span className="text-yellow-500">{r.rating}★</span>
                      </div>

                      <p className="text-gray-600 text-sm mt-1">
                        {r.review_text}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      </Container>
    </section>
  );
}
