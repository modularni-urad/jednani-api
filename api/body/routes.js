import Body from './middleware'
import { ROLE } from '../../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const JSONBodyParser = express.json()
  const body = Body(knex)
  const app = express()

  app.get('/', body.list)
  app.get('/:id', body.get)

  app.post('/',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    body.checkData,
    body.create)

  app.put('/:id',
    auth.required,
    auth.requireMembership(ROLE.ADMIN_BODY),
    JSONBodyParser,
    body.checkData,
    body.update)

  return app
}
