import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import path from 'path'
import parseDataUrl from 'parse-data-url'
import { TNAMES } from '../consts'
const fsPromises = require('fs').promises
const slozkaPriloh = process.env.SLOZKA_PRILOH || '/usr/src/prilohy'

export default { create, update, list, remove }

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
  const row = _.extend({ idbod: bodID }, _.omit(data, 'content'))
  let newRow = null
  return knex(TNAMES.PRILOHY).insert(row).returning('*')
    .then(res => {
      newRow = res[0]
      const fileName = `${newRow.id}_${data.name}`
      const filePath = path.join(slozkaPriloh, fileName)
      return fsPromises.writeFile(filePath, fileContent.toBuffer())
    })
    .then(res => {
      return newRow
    })
}

function update (id, data, author, knex) {
  const fileContent = parseDataUrl(data.content)
  const row = _.omit(data, 'content', 'id', 'idbod', 'created')
  let newRow = null
  return knex(TNAMES.PRILOHY).where({ id }).update(row).returning('*')
    .then(res => {
      newRow = res[0]
      const fileName = `${newRow.id}_${data.name}`
      const filePath = path.join(slozkaPriloh, fileName)
      return fsPromises.writeFile(filePath, fileContent.toBuffer())
    })
    .then(res => {
      return newRow
    })
}

function remove (id, uid, knex) {
  return knex(TNAMES.PRILOHY).where({ id }).del()
}
