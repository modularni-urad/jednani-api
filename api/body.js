
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import { TNAMES } from '../consts'

export default { create, update, list }

function list (query, knex) {
  const fields = query.fields ? query.fields.split(',') : null
  const filter = query.filter ? JSON.parse(query.filter) : {}
  const qb = knex(TNAMES.BODY)
    .where(whereFilter(filter))
    .orderBy('created', 'asc')
  return fields ? qb.select(fields) : qb
}

const editables = [
  'nazev', 'duvod', 'predkl', 'zprac'
]

function create (jednaniID, data, author, knex) {
  data = _.pick(data, editables)
  data.idjendnani = jednaniID
  return knex(TNAMES.BODY).insert(data)
}

function update (id, data, knex) {
  data = _.pick(data, editables)
  return knex(TNAMES.BODY).where({ id }).update(data)
}