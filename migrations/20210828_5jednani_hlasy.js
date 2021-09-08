import { TNAMES, HLAS } from '../consts'
import _ from 'underscore'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.HLASY, (table) => {
    table.increments('id').primary()
    table.integer('idhlasovani')
      .references('id').inTable(TNAMES.HLASOVANI)
    table.enu('hlas', _.values(HLAS)).notNullable()
    table.string('createdby').notNullable()
    table.string('sign')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())

    table.unique(['idhlasovani', 'createdby'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.HLASY)
}
