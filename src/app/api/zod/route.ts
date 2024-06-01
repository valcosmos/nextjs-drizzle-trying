import { createMessageSchema } from '@/server/db/validate-schema'
import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams

  const name = query.get('name')
  const email = query.get('email')
  const message = query.get('message')

  const result = createMessageSchema.safeParse({ name, email, message })

  if (result.success) {
    return NextResponse.json(result.data)
  } else {
    return NextResponse.json(result.error)
  }

}



