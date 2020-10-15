import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import { TNAMES } from '../consts'

export default { create, update, list }

function list (query, knex) {
  const fields = query.fields ? query.fields.split(',') : null
  const filter = query.filter ? JSON.parse(query.filter) : {}
  const qb = knex(TNAMES.USNESENI)
    .where(whereFilter(filter))
    .orderBy('created', 'asc')
  return fields ? qb.select(fields) : qb
}

const editables = [
  'akce', 'osoba', 'text'
]

function create (bodID, data, author, knex) {
  data = _.pick(data, editables)
  data.idbod = bodID
  return knex(TNAMES.USNESENI).insert(data)
}

function update (id, data, knex) {
  data = _.pick(data, editables)
  return knex(TNAMES.USNESENI).where({ id }).update(data)
}