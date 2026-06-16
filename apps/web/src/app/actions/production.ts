'use server'

import {
  createProductionLog as createProductionLogService,
  type CreateProductionLogInput,
} from '@/services/productionService'

export type CreateProductionLogResult = {
  success: boolean
  message: string
}

export async function createProductionLogAction(
  input: CreateProductionLogInput,
): Promise<CreateProductionLogResult> {
  try {
    await createProductionLogService(input)
    return {
      success: true,
      message: 'Log produksi berhasil disimpan dan inventaris diperbarui',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return {
      success: false,
      message,
    }
  }
}
