import { getProducts } from '@/services/productService'
import { getProductionLogs } from '@/services/productionService'
import { ProductionForm } from '@/components/ProductionForm'

export default async function ProductionLogsPage() {
  const [products, logs] = await Promise.all([
    getProducts(),
    getProductionLogs(10),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log Produksi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Catat hasil produksi harian — inventaris akan otomatis bertambah
        </p>
      </div>

      <ProductionForm products={products} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Riwayat Log Produksi
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Operator
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500 italic"
                    >
                      Belum ada log produksi
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.LogID}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.ProductionDate
                          ? new Date(log.ProductionDate).toLocaleString('id-ID')
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {log.Products.ProductName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                        {log.Quantity} {log.Products.Unit ?? ''}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.OperatorName ?? '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
