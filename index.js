import initBodyRoutes from './api/body_routes'
import initJednaniRoutes from './api/jednani_routes'

export default (ctx) => {
  const app = ctx.express()

  app.use('/body', initBodyRoutes(ctx))
  app.use('/jednani', initJednaniRoutes(ctx))

  return app
}
