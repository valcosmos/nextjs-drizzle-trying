import { AppRouter } from "@/server/_app";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

import { createTRPCReact } from '@trpc/react-query'

export const trpcClientReact = createTRPCReact<AppRouter>({})

export const trpcClient = trpcClientReact.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc'
    })
  ]
})