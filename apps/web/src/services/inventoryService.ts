import 'server-only'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import type { InventoryMovements } from '@prisma/client'

export type CreateMovementOutInput = {
  ProductID: number
  Quantity: number
}

export async function getCurrentStock(productId: number): Promise<number> {
  const movements = await prisma.inventoryMovements.findMany({
    where: { ProductID: productId },
    select: { MovementType: true, Quantity: true },
  })

  const totalIn = movements
    .filter((m) => m.MovementType === 'IN')
    .reduce((sum, m) => sum + m.Quantity, 0)

  const totalOut = movements
    .filter((m) => m.MovementType === 'OUT')
    .reduce((sum, m) => sum + m.Quantity, 0)

  return totalIn - totalOut
}

export async function createMovementOut(
  data: CreateMovementOutInput,
): Promise<InventoryMovements> {
  const product = await prisma.products.findUnique({
    where: { ProductID: data.ProductID },
  })
  if (!product) {
    throw new Error(`Produk dengan ID ${data.ProductID} tidak ditemukan`)
  }

  const currentStock = await getCurrentStock(data.ProductID)

  if (currentStock < data.Quantity) {
    throw new Error(
      `Stok tidak mencukupi. Stok saat ini: ${currentStock}, diminta: ${data.Quantity}`,
    )
  }

  const movement = await prisma.inventoryMovements.create({
    data: {
      ProductID: data.ProductID,
      MovementType: 'OUT',
      Quantity: data.Quantity,
    },
  })

  revalidatePath('/inventory/movements')
  revalidatePath('/')
  return movement
}
