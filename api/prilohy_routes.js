import prilohy from './prilohy'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    prilohy.list(req.query, knex).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.post('/:id',
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    (req, res, next) => {
      prilohy.create(req.params.id, req.body, auth.getUID(req), knex)
        .then(createdid => { res.json(createdid) })
        .catch(next)
    })

  app.put('/:id',
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    (req, res, next) => {
      prilohy.update(req.params.id, req.body, auth.getUID(req), knex)
        .then(createdid => { res.json(createdid) })
        .catch(next)
    })

  app.delete('/:id',
    JSONBodyParser,
    (req, res, next) => {
      prilohy.remove(req.params.id, auth.getUID(req), knex)
        .then(createdid => { res.json(createdid) })
        .catch(next)
    })

  return app
}
