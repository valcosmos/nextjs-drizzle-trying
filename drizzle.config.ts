import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: '123456',
    database: 'postgres'
  },
  verbose: true,
  strict: true
})
