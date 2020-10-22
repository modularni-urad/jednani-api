import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.PRILOHY, (table) => {
    table.increments('id').primary()
    table.integer('idbod').notNullable()
      .references('id').inTable(TNAMES.BODY)
    table.string('name')
    table.string('type')
    table.string('size')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.PRILOHY)
}
