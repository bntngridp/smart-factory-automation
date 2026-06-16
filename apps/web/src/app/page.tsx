import { getDashboardStats } from '@/services/dashboardService'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan aktivitas produksi dan inventaris hari ini
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Total Jenis Produk
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Produksi Hari Ini
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                {stats.todayProduction.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">unit</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Aktivitas Inventaris
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                {stats.recentMovements.length}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">terbaru</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            Aktivitas Inventaris Terakhir
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentMovements.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500 italic"
                  >
                    Belum ada aktivitas inventaris
                  </td>
                </tr>
              ) : (
                stats.recentMovements.map((m) => (
                  <tr
                    key={m.MovementID}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {m.MovementDate
                        ? new Date(m.MovementDate).toLocaleString('id-ID')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {m.ProductName}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          m.MovementType === 'IN'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {m.MovementType ?? '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right">
                      {m.Quantity.toLocaleString('id-ID')}{' '}
                      {m.Unit ?? ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
