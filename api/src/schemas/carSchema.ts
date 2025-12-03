import { z } from 'zod'

export const carSchema = z.object({
  model: z.string(),
  year: z.number().int().min(1886),
  brandId: z.number().int(),
  ownerId: z.number().int(),
})
