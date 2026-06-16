import { getProducts } from '@/services/productService'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Master Produk</h1>
        <p className="text-sm text-gray-500 mt-1">
          Daftar produk industri yang tersedia di pabrik
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stok Minimal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500 italic"
                  >
                    Belum ada data produk. Jalankan{' '}
                    <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">
                      npx prisma db seed
                    </code>{' '}
                    untuk mengisi data.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.ProductID}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      #{product.ProductID}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {product.ProductName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.Unit ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.MinStock ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Total: {products.length} produk terdaftar
      </p>
    </div>
  )
}
