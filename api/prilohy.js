import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import path from 'path'
import parseDataUrl from 'parse-data-url'
import { TNAMES } from '../consts'
const fsPromises = require('fs').promises

export default { create, list, remove }

function list (query, knex) {
  const fields = query.fields ? query.fields.split(',') : null
  const filter = query.filter ? JSON.parse(query.filter) : {}
  const qb = knex(TNAMES.PRILOHY)
    .where(whereFilter(filter))
    .orderBy('created', 'asc')
  return fields ? qb.select(fields) : qb
}

function create (bodID, data, author, knex) {
  const fileContent = parseDataUrl(data.content)
  const fileName = path.join(process.env.SLOZKA_PRILOH, data.name)
  return fsPromises.writeFile(fileName, fileContent.toBuffer())
    .then(res => {
      data = _.omit(data, 'content')
      data.idbod = bodID
      return knex(TNAMES.PRILOHY).insert(data).returning('id')
    })
}

function remove (id, uid, knex) {
  return knex(TNAMES.PRILOHY).where({ id }).del()
}
