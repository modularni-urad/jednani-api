import prilohy from './middleware'
import { ROLE } from '../../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const BodyParser = express.json()
  const app = express()

  app.get('/:id', auth.required, (req, res, next) => {
    prilohy.list(req.params.id, req.user, knex).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.post('/:id', auth.required, BodyParser, (req, res, next) => {
    prilohy.create(req.params.id, req.body, req.user, knex).then(result => {
      res.status(201).json(result)
    }).catch(next)
  })

  app.put('/:id', auth.required, BodyParser, (req, res, next) => {
    prilohy.update(req.params.id, req.body, req.user, knex).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.delete('/:id', auth.required, (req, res, next) => {
    prilohy.remove(req.params.id, req.user, knex).then(result => {
      res.json(result)
    }).catch(next)
  })

  return app
}
