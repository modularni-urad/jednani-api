import entity from 'entity-api-base'
import _ from 'underscore'
import { TNAMES } from '../../consts'

const conf = {
  tablename: TNAMES.BODY,
  editables: ['nazev', 'duvod', 'predkl', 'zprac']
}

export default (knex) => ({
  create: (req, res, next) => {
    Object.assign(req.body, { zprac: req.user.id })
    // MULTITENANT && Object.assign(req.body, { orgid: _getOrgId(req) })
    entity.create(req.body, conf, knex)
      .then(saved => res.status(201).json(saved))
      .catch(next)
  },
  update: (req, res, next) => {
    entity.update(req.params.id, req.body, conf, knex)
      .then(saved => res.json(saved))
      .catch(next)
  },
  zaradit: async (req, res, next) => {
    try {
      const q = knex(conf.tablename).where({ id: req.params.id })
      const bod = await q.first()
      if (bod.predkl !== req.user.id.toString()) {
        throw new Error('nemuzete zarazovat na jednani')
      }
      const usneseni = await knex(TNAMES.USNESENI).where({ idbod: bod.id })
      if (usneseni.length === 0) {
        throw new Error('chybi usneseni')
      }
      const change = { idjednani: req.params.idjednani, stav: 'zarazen' }
      const result = await q.update(change).returning('*')
      // vytvor hlasovani
      await knex(TNAMES.HLASOVANI).insert({ idbod: bod.id })
      // TODO: vyhodit az bude knex umet i na sqlite .returning('*') 
      const h = await knex(TNAMES.HLASOVANI).where({ idbod: bod.id }).first()
      // prirad usneseni k tomuto hlasovani
      await knex(TNAMES.USNESENI).where({ idbod: bod.id }).update({ idhlasovani: h.id })
      res.json(result)
    } catch(err) {
      next(err)
    }    
  },
  get: (req, res, next) => {
    entity.get(req.params.id, conf, knex)
      .then(saved => res.json(saved))
      .catch(next)
  },
  list: (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    // MULTITENANT && Object.assign(req.query.filter, { orgid: _getOrgId(req) })
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