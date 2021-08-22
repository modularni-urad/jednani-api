import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.JEDNANI, (table) => {
    table.increments('id').primary()
    table.string('organ').notNullable()
    table.date('datum').notNullable()
    table.string('misto').notNullable()
    table.text('zapis')
    table.string('createdby').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.JEDNANI)
}
