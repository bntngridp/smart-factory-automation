'use client'

import { useState, useTransition } from 'react'
import { createProductionLogAction } from '@/app/actions/production'
import type { Products } from '@prisma/client'

type Props = {
  products: Pick<Products, 'ProductID' | 'ProductName' | 'Unit'>[]
}

export function ProductionForm({ products }: Props) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  function handleSubmit(formData: FormData) {
    const productIdRaw = formData.get('productId') as string | null
    const quantityRaw = formData.get('quantity') as string | null
    const operatorName = (formData.get('operatorName') as string | null)?.trim()

    if (!productIdRaw) {
      setFeedback({ type: 'error', message: 'Produk harus dipilih' })
      return
    }
    if (!quantityRaw || Number(quantityRaw) <= 0) {
      setFeedback({ type: 'error', message: 'Quantity harus lebih dari 0' })
      return
    }
    if (!operatorName) {
      setFeedback({ type: 'error', message: 'Nama operator harus diisi' })
      return
    }

    startTransition(async () => {
      const result = await createProductionLogAction({
        ProductID: Number(productIdRaw),
        Quantity: Number(quantityRaw),
        OperatorName: operatorName,
      })
      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      })
    })
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 bg-white border border-gray-200 rounded-lg p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        Input Hasil Produksi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="productId"
            className="text-sm font-medium text-gray-700"
          >
            Produk
          </label>
          <select
            id="productId"
            name="productId"
            required
            disabled={isPending}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">-- Pilih Produk --</option>
            {products.map((p) => (
              <option key={p.ProductID} value={p.ProductID}>
                {p.ProductName} {p.Unit ? `(${p.Unit})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            required
            disabled={isPending}
            placeholder="contoh: 500"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="operatorName"
            className="text-sm font-medium text-gray-700"
          >
            Nama Operator
          </label>
          <input
            id="operatorName"
            name="operatorName"
            type="text"
            required
            disabled={isPending}
            placeholder="contoh: Budi Santoso"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Log Produksi'}
        </button>

        {feedback && (
          <p
            className={`text-sm ${
              feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </form>
  )
}
