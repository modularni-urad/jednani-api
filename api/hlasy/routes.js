import MWare from './middleware'
import { ROLE } from '../../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const app = express()

  // app.get('/', mware.list)

  app.get('/:id', auth.required, (req, res, next) => {
    MWare.get(req.params.id, req.user, knex).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.post('/:id/:hlas', auth.required, (req, res, next) => {
    MWare.create(req.params.id, req.params.hlas, req.user, knex).then(result => {
      res.json(result)
    }).catch(next)
  })

  return app
}
