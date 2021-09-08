import _ from 'underscore'
import { TNAMES } from '../../consts'

export default { create, list, get }

function list (bodID, user, knex) {
  if (!user) throw new exception(401)
  return knex(TNAMES.PRILOHY).where({ idbod: bodID }).orderBy('created', 'asc')
}

async function get (hlasovaniID, author, knex) {
  const cond = { idhlasovani: hlasovaniID, createdby: author.id }
  return knex(TNAMES.HLASY).where(cond).first()
}

async function create (hlasovaniID, data, author, knex) {
  const hlasovani = await knex(TNAMES.HLASOVANI).where({ id: hlasovaniID }).first()
  const cond = { 
    idhlasovani: hlasovaniID,
    createdby: author.id
  }
  const existing = await knex(TNAMES.HLASY).where(cond).first()
  // const bod = await knex(TNAMES.BODY).where({ id: hlasovani.idbod }).first()

  return existing
    ? knex(TNAMES.HLASY).update({ hlas: data })
    : knex(TNAMES.HLASY).insert(_.extend(cond, { hlas: data })).returning('id')
}