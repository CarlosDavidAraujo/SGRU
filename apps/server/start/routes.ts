/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from '@acme/api'
import { db } from '@acme/db/client'

console.log(db)

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.any('/trpc/*', async (ctx) => {
  const { request, response } = ctx

  const result = await fetchRequestHandler({
    endpoint: '/trpc',
    req: new Request(request.completeUrl(true), {
      //headers: request.headers(),
      body: request.method() !== 'GET' ? JSON.stringify(request.body()) : undefined,
      method: request.method(),
    }),
    router: appRouter,
    createContext: () => ctx,
  })

  const responseText = await new Response(result.body).text()

  return response
    .status(result.status)
    .header('content-type', 'application/json')
    .send(responseText)
})
