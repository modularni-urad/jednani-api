import path from 'path'
import express from 'express'
import { attachPaginate } from 'knex-paginate'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import { required, requireMembership } from 'modularni-urad-utils/auth'
import initDB from 'modularni-urad-utils/db'

import initBodyRoutes from './api/body/routes'
import initJednaniRoutes from './api/jednani/routes'
import initUsneseniRoutes from './api/usneseni/routes'
import initHlasovani from './api/hlasovani/routes'
import initPrilohyRoutes from './api/prilohy/routes'
import initHlasyRoutes from './api/hlasy/routes'

export default async function init (mocks = null) {
  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()
  const app = express()
  const ctx = { express, knex, auth: { required, requireMembership } }

  app.use('/body', initBodyRoutes(ctx))
  app.use('/jednani', initJednaniRoutes(ctx))
  app.use('/usneseni', initUsneseniRoutes(ctx))
  app.use('/hlasovani', initHlasovani(ctx))
  app.use('/prilohy', initPrilohyRoutes(ctx))
  app.use('/hlasy', initHlasyRoutes(ctx))

  initErrorHandlers(app) // ERROR HANDLING

  return app
}
