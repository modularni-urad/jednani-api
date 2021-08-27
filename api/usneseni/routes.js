import Usneseni from './middleware'
import { ROLE } from '../../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const JSONBodyParser = express.json()
  const usneseni = Usneseni(knex)
  const app = express()

  app.get('/', usneseni.list)

  app.post('/:idbod([0-9]+)',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    usneseni.checkData,
    usneseni.create)

  app.put('/:id([0-9]+)',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    usneseni.checkData,
    usneseni.update)

  return app
}
