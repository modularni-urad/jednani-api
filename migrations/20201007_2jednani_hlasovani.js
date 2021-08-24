import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.HLASOVANI, (table) => {
    table.increments('id').primary()
    table.integer('idbod')
      .references('id').inTable(TNAMES.BODY)
    table.string('stav').notNullable().defaultTo('pred')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.HLASOVANI)
}
