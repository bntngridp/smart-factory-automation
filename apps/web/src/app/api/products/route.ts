import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/services/productService'
import { createProductSchema, formatZodError } from '@/lib/validations'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 })
    }

    const product = await createProduct({
      ProductName: parsed.data.ProductName,
      Unit: parsed.data.Unit,
      MinStock: parsed.data.MinStock,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
