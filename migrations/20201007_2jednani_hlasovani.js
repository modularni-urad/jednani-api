import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.HLASOVANI, (table) => {
    table.increments('id').primary()
    table.integer('idbod')
      .references('id').inTable(TNAMES.BODY)
    // table.integer('tajne').defaultTo(0)
    table.timestamp('zacatek')
    table.timestamp('konec')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.HLASOVANI)
}
