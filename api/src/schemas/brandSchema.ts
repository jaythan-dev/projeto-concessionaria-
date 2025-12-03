import { z } from 'zod'
import { qualquercoisa } from '../routes/brandRoutes'

export const brandSchema = z.object({
  name: z.string().min(2),
})

export const qualquercoisa1:any = 1