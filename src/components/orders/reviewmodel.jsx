// "use client";

// import { useState } from "react";

// import {
//   Star,
//   X,
// } from "lucide-react";

// import useOrders from "@/hooks/useorderreview";

// export default function ReviewModal({
//   order,
//   onClose,
// }) {
//   const [reviewText, setReviewText] =
//     useState("");

//   const [rating, setRating] =
//     useState(0);

//   const [hoverRating, setHoverRating] =
//     useState(0);

//   const {
//     createReview,
//     reviewLoading,
//     error,
//     success,
//   } = useOrders();

//   if (!order) return null;

//   // =========================
//   // SUBMIT REVIEW
//   // =========================
//   const handleSubmitReview =
//     async () => {
//       if (!rating) return;

//       const payload = {
//         // REQUIRED
//         product_id:
//           order?.product_id,

//         // REQUIRED
//         rating: rating,

//         // REQUIRED
//         review_text:
//           reviewText,

//         // NULL IMAGE
//         image_url: null,
//       };

//       console.log(
//         "REVIEW PAYLOAD =>",
//         payload
//       );

//       const response =
//         await createReview(payload);

//       if (response !== false) {
//         setReviewText("");

//         setRating(0);

//         onClose();
//       }
//     };

//   return (
//     <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//       {/* MODAL */}
//       <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
//         {/* HEADER */}
//         <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
//           <div>
//             <h2 className="text-lg font-bold text-black">
//               Write Review
//             </h2>

//             <p className="mt-1 text-xs text-gray-500">
//               Share your product
//               experience
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-full p-2 transition hover:bg-gray-100"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="p-5">
//           {/* PRODUCT CARD */}
//           <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
//             <img
//               src={
//                 order?.image ||
//                 "/placeholder.png"
//               }
//               alt={
//                 order?.product_name
//               }
//               className="h-16 w-16 rounded-xl border object-cover"
//             />

//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-black">
//                 {order?.product_name ||
//                   "Product"}
//               </h3>

//               <p className="mt-1 text-xs text-gray-500">
//                 Order #
//                 {order?.order_number}
//               </p>

//               <p className="mt-1 text-sm font-semibold text-black">
//                 ₹
//                 {order?.total_amount}
//               </p>
//             </div>
//           </div>

//           {/* RATING */}
//           <div className="mb-5">
//             <label className="mb-2 block text-sm font-semibold text-black">
//               Overall Rating
//             </label>

//             <div className="flex items-center gap-1">
//               {[1, 2, 3, 4, 5].map(
//                 (star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() =>
//                       setRating(star)
//                     }
//                     onMouseEnter={() =>
//                       setHoverRating(
//                         star
//                       )
//                     }
//                     onMouseLeave={() =>
//                       setHoverRating(0)
//                     }
//                     className="transition hover:scale-110"
//                   >
//                     <Star
//                       size={28}
//                       className={`transition ${
//                         star <=
//                         (hoverRating ||
//                           rating)
//                           ? "fill-yellow-400 text-yellow-400"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   </button>
//                 )
//               )}
//             </div>

//             {!rating && (
//               <p className="mt-2 text-xs text-red-500">
//                 Please select rating
//               </p>
//             )}
//           </div>

//           {/* REVIEW TEXT */}
//           <div>
//             <label className="mb-2 block text-sm font-semibold text-black">
//               Review Description
//             </label>

//             <textarea
//               rows={4}
//               value={reviewText}
//               onChange={(e) =>
//                 setReviewText(
//                   e.target.value
//                 )
//               }
//               placeholder="Write your review..."
//               className="
//                 w-full
//                 rounded-2xl
//                 border
//                 border-gray-300
//                 bg-white
//                 p-3
//                 text-sm
//                 outline-none
//                 transition
//                 focus:border-black
//               "
//             />
//           </div>

//           {/* ERROR */}
//           {error && (
//             <p className="mt-3 text-sm text-red-500">
//               {error}
//             </p>
//           )}

//           {/* SUCCESS */}
//           {success && (
//             <p className="mt-3 text-sm text-green-600">
//               {success}
//             </p>
//           )}

//           {/* FOOTER */}
//           <div className="mt-6 flex gap-3">
//             <button
//               onClick={onClose}
//               className="
//                 h-11
//                 flex-1
//                 rounded-2xl
//                 border
//                 border-gray-300
//                 text-sm
//                 font-semibold
//                 text-black
//                 transition
//                 hover:bg-gray-100
//               "
//             >
//               Cancel
//             </button>

//             <button
//               onClick={
//                 handleSubmitReview
//               }
//               disabled={reviewLoading}
//               className="
//                 h-11
//                 flex-1
//                 rounded-2xl
//                 bg-black
//                 text-sm
//                 font-semibold
//                 text-white
//                 transition
//                 hover:opacity-90
//                 disabled:opacity-70
//               "
//             >
//               {reviewLoading
//                 ? "Submitting..."
//                 : "Submit Review"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState } from "react";

import {
  Star,
  X,
} from "lucide-react";

import useOrders from "@/hooks/useorderreview";

export default function ReviewModal({
  order,
  onClose,
}) {
  const [reviewText, setReviewText] =
    useState("");

  const [rating, setRating] =
    useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [validationError, setValidationError] =
    useState("");

  const {
    createReview,
    reviewLoading,
    reviewError,
    reviewSuccess,
  } = useOrders();

  if (!order) return null;

  // =========================
  // SUBMIT REVIEW
  // =========================
  const handleSubmitReview =
    async () => {
      setValidationError("");

      // VALIDATE RATING
      if (!rating) {
        setValidationError(
          "Please select rating"
        );
        return;
      }

      // GET PRODUCT ID
      const productId =
        order?.product_id ||
        order?.product?.id ||
        order?.id;

      console.log(
        "ORDER =>",
        order
      );

      // VALIDATE PRODUCT ID
      if (!productId) {
        setValidationError(
          "Product not found"
        );

        return;
      }

      // PAYLOAD
      const payload = {
        product_id: productId,
        rating: rating,
        review_text: reviewText,
        image_url: null,
      };

      console.log(
        "REVIEW PAYLOAD =>",
        payload
      );

      // API CALL
      const response =
        await createReview(payload);

      // SUCCESS
      if (response !== false) {
        setReviewText("");

        setRating(0);

        setHoverRating(0);

        onClose();
      }
    };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-black">
              Write Review
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Share your product
              experience
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          {/* PRODUCT CARD */}
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <img
              src={
                order?.image ||
                "/placeholder.png"
              }
              alt={
                order?.product_name ||
                "Product"
              }
              className="h-16 w-16 rounded-xl border object-cover"
            />

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-black">
                {order?.product_name ||
                  "Product"}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Order #
                {order?.order_number}
              </p>

              <p className="mt-1 text-sm font-semibold text-black">
                ₹
                {order?.total_amount}
              </p>
            </div>
          </div>

          {/* RATING */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-black">
              Overall Rating
            </label>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRating(star)
                    }
                    onMouseEnter={() =>
                      setHoverRating(
                        star
                      )
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    className="transition hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={`transition ${
                        star <=
                        (hoverRating ||
                          rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                )
              )}
            </div>

            {!rating && (
              <p className="mt-2 text-xs text-red-500">
                Please select rating
              </p>
            )}
          </div>

          {/* REVIEW TEXT */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Review Description
            </label>

            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) =>
                setReviewText(
                  e.target.value
                )
              }
              placeholder="Write your review..."
              className="
                w-full
                rounded-2xl
                border
                border-gray-300
                bg-white
                p-3
                text-sm
                outline-none
                transition
                focus:border-black
              "
            />
          </div>

          {/* VALIDATION ERROR */}
          {validationError && (
            <p className="mt-3 text-sm text-red-500">
              {validationError}
            </p>
          )}

          {/* REVIEW ERROR */}
          {reviewError && (
            <p className="mt-3 text-sm text-red-500">
              {reviewError}
            </p>
          )}

          {/* REVIEW SUCCESS */}
          {reviewSuccess && (
            <p className="mt-3 text-sm text-green-600">
              {reviewSuccess}
            </p>
          )}

          {/* FOOTER */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="
                h-11
                flex-1
                rounded-2xl
                border
                border-gray-300
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

            <button
              onClick={
                handleSubmitReview
              }
              disabled={reviewLoading}
              className="
                h-11
                flex-1
                rounded-2xl
                bg-black
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
                disabled:opacity-70
              "
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}