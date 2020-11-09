
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import { TNAMES } from '../consts'

export default { create, update, list }

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const fields = query.fields ? query.fields.split(',') : null
  const sort = query.sort ? query.sort.split(':') : null
  const filter = query.filter ? JSON.parse(query.filter) : null
  let qb = knex(TNAMES.BODY)
  qb = filter ? qb.where(whereFilter(filter)) : qb
  qb = fields ? qb.select(fields) : qb
  qb = sort ? qb.orderBy(sort[0], sort[1]) : qb
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

const editables = [
  'nazev', 'duvod', 'predkl'
]

function create (data, author, knex) {
  data = _.pick(data, editables)
  data.zprac = author
  data.stav = 'draft'
  return knex(TNAMES.BODY).insert(data).returning('id')
}

function update (id, data, knex) {
  data = _.pick(data, editables)
  return knex(TNAMES.BODY).where({ id }).update(data)
}
