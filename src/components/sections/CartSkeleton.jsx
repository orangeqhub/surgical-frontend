export default function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white rounded-2xl p-5 animate-pulse"
        >
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>

            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>

              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>

              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}