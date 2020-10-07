import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.BODY, (table) => {
    table.increments('id').primary()
    table.integer('idjendnani').notNullable()
      .references('id').inTable(TNAMES.JEDNANI)
    table.string('nazev').notNullable()
    table.text('duvod').notNullable()
    table.string('predkl').notNullable()
    table.string('zprac').notNullable()
    table.integer('stav').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.BODY)
}
