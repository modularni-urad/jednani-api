import initBodyRoutes from './api/body_routes'
import initJednaniRoutes from './api/jednani_routes'
import initUsneseniRoutes from './api/usneseni_routes'
import initPrilohyRoutes from './api/prilohy_routes'

export default (ctx) => {
  const app = ctx.express()

  app.use('/body', initBodyRoutes(ctx))
  app.use('/jednani', initJednaniRoutes(ctx))
  app.use('/usneseni', initUsneseniRoutes(ctx))
  app.use('/prilohy', initPrilohyRoutes(ctx))

  return app
}
