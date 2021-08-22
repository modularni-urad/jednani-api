import Jednani from './jednani'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const JSONBodyParser = express.json()
  const jednani = Jednani(knex)
  const app = express()

  app.get('/', jednani.list)

  app.get('/:id', jednani.get)

  app.post('/',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_JEDNANI),
    JSONBodyParser,
    jednani.create)

  app.put('/:id([0-9]+)',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_JEDNANI),
    JSONBodyParser,
    jednani.update)

  return app
}
