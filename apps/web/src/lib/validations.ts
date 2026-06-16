import { z } from 'zod'

export const createProductSchema = z.object({
  ProductName: z
    .string()
    .trim()
    .min(1, 'Nama produk tidak boleh kosong')
    .max(100, 'Nama produk maksimal 100 karakter'),
  Unit: z
    .string()
    .trim()
    .max(20, 'Unit maksimal 20 karakter')
    .nullish()
    .transform((val) => (val == null || val === '' ? null : val)),
  MinStock: z
    .number()
    .int('MinStock harus bilangan bulat')
    .min(0, 'MinStock tidak boleh negatif')
    .nullish()
    .transform((val) => val ?? 0),
})

export const createProductionLogSchema = z.object({
  product_id: z
    .number()
    .int('product_id harus bilangan bulat')
    .positive('product_id harus angka positif'),
  quantity: z
    .number()
    .int('quantity harus bilangan bulat')
    .positive('quantity harus lebih dari 0'),
  operator_name: z
    .string()
    .trim()
    .min(1, 'operator_name tidak boleh kosong')
    .max(50, 'operator_name maksimal 50 karakter'),
})

export const createMovementOutSchema = z.object({
  product_id: z
    .number()
    .int('product_id harus bilangan bulat')
    .positive('product_id harus angka positif'),
  quantity: z
    .number()
    .int('quantity harus bilangan bulat')
    .positive('quantity harus lebih dari 0'),
  movement_type: z
    .string()
    .nullish()
    .transform((val) => (val == null ? 'OUT' : val.toUpperCase())),
})

export function formatZodError(error: z.ZodError) {
  return {
    error: 'Validasi gagal',
    details: error.issues.map((e) => ({
      field: e.path.join('.') || '(root)',
      message: e.message,
    })),
  }
}
