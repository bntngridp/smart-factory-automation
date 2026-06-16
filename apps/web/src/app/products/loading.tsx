export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 h-10" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 border-t border-gray-200 bg-white animate-pulse"
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 italic">Memuat data produk...</p>
    </div>
  )
}
