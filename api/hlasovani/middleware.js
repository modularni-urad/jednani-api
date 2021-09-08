import entity from 'entity-api-base'
import _ from 'underscore'
import { TNAMES } from '../../consts'

const conf = {
  tablename: TNAMES.HLASOVANI,
  // editables: ['nazev', 'duvod', 'predkl', 'zprac']
}

export default { start, create, list }

function start (ids, doba, user, knex) {
  doba = doba || 10 // 10 s
  const zacatek = new Date()
  const konec = new Date(zacatek.getTime() + (doba * 1000))
  return knex(TNAMES.HLASOVANI).where('id', 'in', ids).update({ zacatek, konec })
}

function create (data, knex) {
  return entity.create(data, conf, knex)
}
  
function list (query, knex) {
  return entity.list(query, conf, knex)
}