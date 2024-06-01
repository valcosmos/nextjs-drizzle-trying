import { z } from 'zod'
import { db } from './db/db'
import { publicProcedure, router } from './trpc'
import { messages } from './db/schema'
import { eq } from 'drizzle-orm'
export const appRouter = router({
  greeting: publicProcedure.query(() => 'hello tRPC v10!'),
  getMessages: publicProcedure.query(async ({ ctx }) => {
    return db.query.messages.findMany()
  }),
  setMessage: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        message: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(messages).values(input).returning()
      return result[0]
    }),
  updateMessage: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        message: z.string()
      })
    )
    .mutation(({input, ctx }) => {
      return db.update(messages)
        .set({ name: input.name, email: input.email, message: input.message })
        .where(eq(messages.id, input.id))
    }),
  deleteMessage: publicProcedure.input(z.number()).mutation(({input}) => { 
    return db.delete(messages).where(eq(messages.id, input))
  })
})

export type AppRouter = typeof appRouter
