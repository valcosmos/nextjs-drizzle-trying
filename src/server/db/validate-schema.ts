import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

import { messages } from './schema'
import { z } from 'zod'

export const createMessageSchema = createInsertSchema(messages, {
  // 覆盖默认类型
  email: schema=>schema.email.email()
})

export const updateMessageSchema = createMessageSchema.pick({ email: true })

export const queryMessageSchema = createSelectSchema(messages)

export type MessageProps = Omit<z.infer<typeof queryMessageSchema>, 'createdAt' | 'updatedAt'> & {
  updatedAt: string | null
  createdAt: string | null
}