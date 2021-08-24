import MWare from './middleware'
import { ROLE } from '../../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const mware = MWare(knex)
  const app = express()

  app.get('/', mware.list)

  app.post('/',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_HLASOVANI),
    mware.create)

  // app.post('/clone/:id')

  return app
}
