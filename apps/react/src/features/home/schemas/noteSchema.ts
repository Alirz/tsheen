import { z } from 'zod'

export const noteSchema = z.object({
  note: z.string().trim().min(1, 'NoteRequired').max(100),
})

export type NoteFormValues = z.infer<typeof noteSchema>
