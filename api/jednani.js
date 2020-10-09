import { TNAMES } from '../consts'
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'

export default { create, update, list, get }

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const fields = query.fields ? query.fields.split(',') : null
  const sort = query.sort ? query.sort.split(':') : null
  const filter = query.filter ? JSON.parse(query.filter) : null
  let qb = knex(TNAMES.JEDNANI)
  qb = filter ? qb.where(whereFilter(filter)) : qb
  qb = fields ? qb.select(fields) : qb
  qb = sort ? qb.orderBy(sort[0], sort[1]) : qb
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

export function get (appId, devId, knex) {
  return knex(TNAMES.JEDNANI)
    .where({ app_id: appId, dev_id: devId }).first()
}

const editables = [
  'organ', 'datum', 'zapis'
]

export function create (body, knex) {
  body = _.pick(body, editables)
  return knex(TNAMES.JEDNANI).returning('id').insert(body)
}

export function update (devid, body, knex) {
  body = _.pick(body, editables)
  return knex(TNAMES.JEDNANI).where({ id: devid }).update(body)
}
