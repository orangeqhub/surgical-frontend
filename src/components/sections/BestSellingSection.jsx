"use client";

import { useEffect } from "react";
import {
  Container,
  ProductCard,
  Text,
} from "..";

import useProducts from "@/hooks/useProducts";

export default function BestSellingSection() {
  const {
    products,
    loading,
    fetchProducts,
  } = useProducts();

  useEffect(() => {
    fetchProducts({
      page: 1,
      page_size: 10,
    });
  }, []);

  return (
    <section className="py-12 lg:py-16">
    <Container className="max-w-[1700px] px-6 lg:px-10 xl:px-12">
        {/* Heading */}
        <div className="mb-8 text-center">
          <Text
            as="h2"
            variant="h2"
            className="text-black"
          >
            Best Selling Products
          </Text>

          <Text className="mx-auto mt-2 max-w-2xl">
            Trusted healthcare essentials chosen by thousands
            of customers across India.
          </Text>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-16 text-center">
            <Text>Loading products...</Text>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}