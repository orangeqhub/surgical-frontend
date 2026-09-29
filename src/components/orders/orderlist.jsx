"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ReviewModal from "./reviewmodel";
import TrackOrderModal from "./trackordermodel";
import useOrders from "@/hooks/useorderreview";

export default function OrdersList() {
  const router = useRouter();

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const { orders, loading, error } = useOrders();

  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const handleProductClick = (productId) => {
    if (!productId) return;
    router.push(`/products/${productId}`);
  };

  const handleOpenTrackModal = (e, orderId) => {
    e.stopPropagation();
    setSelectedTrackOrderId(orderId);
    setIsTrackModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black">My Orders</h2>
        <p className="mt-1 text-sm text-gray-500">
          View your orders and review products.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500">
          Loading orders...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && orders?.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500">
          No orders found
        </div>
      )}

      {!loading &&
        orders?.map((order) => {
          const rawStatus = order?.status || order?.order_status || "";
          const normalizedStatus = rawStatus
            .toString()
            .toLowerCase()
            .replace(/_|-/g, " ")
            .trim();

          // Enabled strictly for 'packed', 'shipped', and 'out for delivery'
          const trackableStatuses = ["packed", "shipped", "out for delivery"];
          const canTrackOrder = trackableStatuses.includes(normalizedStatus);

          return (
            <div
              key={order?.order_id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white"
            >
              {/* ORDER HEADER */}
              <div
                onClick={() => toggleOrder(order?.order_id)}
                className="flex w-full cursor-pointer items-center justify-between p-5 text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-black">
                    Order #{order?.order_number}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Status:
                    <span className="ml-1 capitalize text-green-600">
                      {order?.status}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Payment:
                    <span className="ml-1 capitalize text-black">
                      {order?.payment_status}
                    </span>
                  </p>

                  <p className="mt-2 text-xl font-bold text-black">
                    ₹{Number(order?.total_amount || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* TRACK ORDER BUTTON */}
                  {canTrackOrder && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenTrackModal(e, order?.order_id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-text-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <Truck size={16} />
                      Track Order
                    </button>
                  )}

                  {expandedOrder === order?.order_id ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>
              </div>

              {/* PRODUCTS */}
              {expandedOrder === order?.order_id && (
                <div className="border-t border-gray-100 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    {order?.products?.map((product) => (
                      <div
                        key={product?.product_id}
                        className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4"
                      >
                        <img
                          src={product?.product_image || "/placeholder.png"}
                          alt={product?.product_name}
                          onClick={() => handleProductClick(product?.product_id)}
                          className="h-24 w-24 cursor-pointer rounded-2xl border object-cover transition hover:opacity-90"
                        />

                        <div className="flex-1">
                          <h4
                            onClick={() => handleProductClick(product?.product_id)}
                            className="cursor-pointer font-semibold text-black transition hover:text-gray-600"
                          >
                            {product?.product_name}
                          </h4>

                          {normalizedStatus === "delivered" && (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedProduct({
                                  ...product,
                                  order_number: order?.order_number,
                                  total_amount: order?.total_amount,
                                  payment_status: order?.payment_status,
                                  status: order?.status,
                                  image: product?.product_image,
                                })
                              }
                              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-text-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                              <Star size={16} />
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {/* REVIEW MODAL */}
      {selectedProduct && (
        <ReviewModal
          order={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* TRACK ORDER MODAL */}
      <TrackOrderModal
        orderId={selectedTrackOrderId}
        isOpen={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setSelectedTrackOrderId(null);
        }}
      />
    </div>
  );
}