import Body from './body'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const JSONBodyParser = express.json()
  const body = Body(knex)
  const app = express()

  app.get('/', body.list)

  app.post('/',
    body.checkData,
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    body.list)

  app.put('/:id',
    body.checkData,
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    body.update)

  return app
}
