import { NextRequest, NextResponse } from 'next/server'
import { createProductionLog } from '@/services/productionService'
import { createProductionLogSchema, formatZodError } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createProductionLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 })
    }

    const log = await createProductionLog({
      ProductID: parsed.data.product_id,
      Quantity: parsed.data.quantity,
      OperatorName: parsed.data.operator_name,
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'

    if (message.includes('tidak ditemukan')) {
      return NextResponse.json({ error: message }, { status: 404 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
