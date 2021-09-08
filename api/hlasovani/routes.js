import MWare from './middleware'
import { ROLE } from '../../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const app = express()

  app.get('/', (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    // MULTITENANT && Object.assign(req.query.filter, { orgid: _getOrgId(req) })
    MWare.list(req.query, knex).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.put('/start', 
    auth.required, 
    auth.requireMembership(ROLE.ADMIN_HLASOVANI),
    (req, res, next) => {
      const ids = req.query.ids.split(',')
      MWare.start(ids, req.query.doba, req.user, knex).then(result => {
        res.json(result)
      }).catch(next)
  })

  app.post('/',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_HLASOVANI),
    (req, res, next) => {
      const data = req.query.body.split(',').map(i => ({ idbod: i }))
      // MULTITENANT && Object.assign(req.body, { orgid: _getOrgId(req) })
      MWare.create(data, knex).then(result => {
        res.status(201).json(result)
      }).catch(next)
    }
  )

  // app.post('/clone/:id')

  return app
}
