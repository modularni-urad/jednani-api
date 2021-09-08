import entity from 'entity-api-base'
import _ from 'underscore'
import { TNAMES } from '../../consts'

const conf = {
  tablename: TNAMES.USNESENI,
  editables: ['akce', 'osoba', 'text', 'navrhl']
}

export default (knex) => ({
  create: (req, res, next) => {
    Object.assign(req.body, { 
      idbod: req.params.idbod,
      navrhl: req.body.navrhl || req.user.id
    })
    // MULTITENANT && Object.assign(req.body, { orgid: _getOrgId(req) })
    entity.create(req.body, conf, knex)
      .then(saved => res.status(201).json(saved))
      .catch(next)
  },
  get: (req, res, next) => {
  },
  update: (req, res, next) => {
    entity.update(req.params.id, req.body, conf, knex)
      .then(saved => res.json(saved))
      .catch(next)
  },
  list: (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    // MULTITENANT && Object.assign(req.query.filter, { orgid: _getOrgId(req) })
    // TODO: implicity sort .orderBy('created', 'asc')
    entity.list(req.query, conf, knex)
      .then(data => res.json(data))
      .catch(next)
  },
  checkData: (req, res, next) => {
    try {
      entity.check_data(req.body, conf)
      next()
    } catch (err) {
      next(err)
    }
  }
})