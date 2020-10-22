import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.USNESENI, (table) => {
    table.increments('id').primary()
    table.integer('idbod').notNullable()
      .references('id').inTable(TNAMES.BODY)
    table.string('akce') // bere na vedomi, odvolava, jmenuje, poveruje
    table.string('osoba')
    table.string('text')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.USNESENI)
}
