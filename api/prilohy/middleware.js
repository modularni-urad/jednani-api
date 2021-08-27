import _ from 'underscore'
import path from 'path'
import parseDataUrl from 'parse-data-url'
import { TNAMES } from '../../consts'
const fsPromises = require('fs').promises
const slozkaPriloh = process.env.SLOZKA_PRILOH || '/usr/src/prilohy'

export default { create, update, list, remove }

function list (bodID, user, knex) {
  if (!user) throw new exception(401)
  return knex(TNAMES.PRILOHY).where({ idbod: bodID }).orderBy('created', 'asc')
}

function canEditAttachements(bod, user) {
  return true
}

async function create (bodID, data, author, knex) {
  const bod = await knex(TNAMES.BODY).where({ id: bodID }).first()
  if (!canEditAttachements(bod, author)) {
    throw new Error('not allowed edit attachments')
  }
  if (!data.content) throw new Error('file missing')
  const row = _.extend({ idbod: bodID }, _.omit(data, 'content'))
  const newItem = await knex(TNAMES.PRILOHY).insert(row).returning('*')
  await saveFile(newItem, data)
  return newItem
}

function saveFile (newRow, data) {
  const fileContent = Buffer.from(data.content, 'base64')
  const fileName = newRow.id || newRow[0]
  const filePath = path.join(slozkaPriloh, fileName.toString())
  return fsPromises.writeFile(filePath, fileContent)
}

async function update (id, data, user, knex) {
  const priloha = await knex(TNAMES.PRILOHY).where({ id }).first()
  const bod = await knex(TNAMES.BODY).where({ id: priloha.idbod }).first()
  if (!canEditAttachements(bod, author)) {
    throw new Error('not allowed edit attachments')
  }
  const row = _.omit(data, 'content', 'id', 'idbod', 'created')
  const newItem = await knex(TNAMES.PRILOHY).where({ id }).update(row).returning('*')
  data.content && await saveFile(newItem, data)
  return newItem
}

async function remove (id, user, knex) {
  const priloha = await knex(TNAMES.PRILOHY).where({ id }).first()
  const bod = await knex(TNAMES.BODY).where({ id: priloha.idbod }).first()
  if (!canEditAttachements(bod, user)) {
    throw new Error('not allowed edit attachments')
  }
  // TODO: check jestli je jeste bod ve stavu kdy se jeste muze menit priloha
  return knex(TNAMES.PRILOHY).where({ id }).del()
}
