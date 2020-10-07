import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.JEDNANI, (table) => {
    table.increments('id').primary()
    table.string('organ').notNullable()
    table.date('datum').notNullable()
    table.text('zapis')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.JEDNANI)
}
