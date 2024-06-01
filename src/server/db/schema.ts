import { serial, text, timestamp, pgTable } from 'drizzle-orm/pg-core'

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at')
})
