import { z } from 'zod'

export const ownerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export default ownerSchema