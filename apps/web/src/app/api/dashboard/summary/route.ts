import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [totalProducts, todayAgg, products] = await Promise.all([
      prisma.products.count(),
      prisma.productionLogs.aggregate({
        _sum: { Quantity: true },
        where: { ProductionDate: { gte: startOfToday } },
      }),
      prisma.products.findMany({
        where: { MinStock: { gt: 0 } },
        include: {
          InventoryMovements: {
            select: { MovementType: true, Quantity: true },
          },
        },
      }),
    ])

    type Movement = { MovementType: string | null; Quantity: number }

    const lowStockAlerts = products
      .map((product) => {
        const movements = product.InventoryMovements as Movement[]
        const totalIn = movements
          .filter((m) => m.MovementType === 'IN')
          .reduce((sum: number, m) => sum + m.Quantity, 0)
        const totalOut = movements
          .filter((m) => m.MovementType === 'OUT')
          .reduce((sum: number, m) => sum + m.Quantity, 0)

        const currentStock = totalIn - totalOut
        const minStock = product.MinStock ?? 0

        return {
          ProductID: product.ProductID,
          ProductName: product.ProductName,
          Unit: product.Unit,
          MinStock: minStock,
          CurrentStock: currentStock,
        }
      })
      .filter((p) => p.CurrentStock < p.MinStock)

    return NextResponse.json(
      {
        total_products: totalProducts,
        total_production_today: todayAgg._sum.Quantity ?? 0,
        low_stock_alerts: lowStockAlerts,
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
