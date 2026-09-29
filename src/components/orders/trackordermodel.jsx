

"use client";

import { X, Truck, MapPin, Calendar, Loader2, PackageCheck, User, Phone } from "lucide-react";
import { useTrackOrder } from "@/hooks/useTrackorder";

export default function TrackOrderModal({ orderId, isOpen, onClose }) {
  const { data: tracking, loading, error } = useTrackOrder(isOpen ? orderId : null);

  if (!isOpen) return null;

  // Format destination city/state safely from either an object or string
  const destinationCity =
    typeof tracking?.destination === "object"
      ? [tracking?.destination?.city, tracking?.destination?.state]
          .filter(Boolean)
          .join(", ")
      : tracking?.destination || "N/A";

  const destinationAddress = typeof tracking?.destination === "object" ? tracking.destination : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl transition-all">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Truck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Track Shipment</h2>
              <p className="text-xs text-gray-500">
                Order: <span className="font-semibold text-gray-700">{tracking?.order_number || "..."}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-3 text-sm font-medium">Fetching shipment status...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="my-6 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CONTENT */}
        {!loading && !error && tracking && (
          <div className="mt-5 space-y-6">
            {/* OVERVIEW CARD */}
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Courier</span>
                  <p className="font-semibold text-gray-800">{tracking?.courier || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-400">AWB Number</span>
                  <p className="font-semibold text-gray-800">{tracking?.awb_number || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Tracking Status</span>
                  <p className="capitalize font-semibold text-blue-600">
                    {tracking?.tracking_status || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Order Status</span>
                  <p className="capitalize font-semibold text-green-600">
                    {tracking?.order_status || "N/A"}
                  </p>
                </div>
              </div>

              {/* ROUTE */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200/60 pt-3 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate max-w-[120px]">{tracking?.origin || "Origin"}</span>
                </div>
                <div className="h-[2px] flex-1 border-t-2 border-dashed border-gray-300 mx-3" />
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <MapPin size={14} className="text-blue-600 shrink-0" />
                  <span className="truncate max-w-[140px]">{destinationCity}</span>
                </div>
              </div>

              {/* DELIVERY ADDRESS DETAILS */}
              {destinationAddress && (
                <div className="mt-3 rounded-xl bg-white/70 p-2.5 text-[11px] text-gray-600 border border-gray-100">
                  <div className="flex items-center gap-1 font-semibold text-gray-800">
                    <User size={12} />
                    <span>{destinationAddress.full_name}</span>
                    {destinationAddress.phone && (
                      <span className="ml-2 font-normal text-gray-500 flex items-center gap-0.5">
                        <Phone size={10} /> {destinationAddress.phone}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-gray-500">
                    {[
                      destinationAddress.address_line1,
                      destinationAddress.address_line2,
                      destinationAddress.city,
                      destinationAddress.state,
                      destinationAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* TRACKING TIMELINE */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-900">Shipment History</h3>
              {tracking?.scans && tracking.scans.length > 0 ? (
                <div className="relative ml-2 border-l-2 border-gray-200 pl-6 space-y-6">
                  {tracking.scans.map((scan, index) => (
                    <div key={index} className="relative">
                      {/* TIMELINE ICON DOT */}
                      <span className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white">
                        <PackageCheck size={12} className="text-white" />
                      </span>

                      {/* DETAILS */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {scan.scan_status}
                        </p>
                        {scan.scanned_location && (
                          <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {scan.scanned_location}
                          </p>
                        )}
                        {scan.scanned_at && (
                          <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(scan.scanned_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No tracking updates recorded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}