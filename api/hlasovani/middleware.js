import entity from 'entity-api-base'
import _ from 'underscore'
import { TNAMES } from '../../consts'

const conf = {
  tablename: TNAMES.HLASOVANI,
  // editables: ['nazev', 'duvod', 'predkl', 'zprac']
}

export default (knex) => ({
  create: (req, res, next) => {
    const data = req.query.body.split(',').map(i => ({ idbod: i }))
    // MULTITENANT && Object.assign(req.body, { orgid: _getOrgId(req) })
    entity.create(data, conf, knex)
      .then(saved => res.status(201).json(saved))
      .catch(next)
  },
  list: (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    // MULTITENANT && Object.assign(req.query.filter, { orgid: _getOrgId(req) })
    entity.list(req.query, conf, knex)
      .then(data => res.json(data))
      .catch(next)
  }
})