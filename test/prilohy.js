/* global describe it */
import moment from 'moment'
import _ from 'underscore'
import { ROLE } from '../consts'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const content = 'pok1 __with__ device'
  const p = {
    name: 'povidani'
  }
  const encContent = 'data:text/plain;charset=utf-8;base64,cG9rMSBfX3dpdGhfXyBkZXZpY2U='

  return describe('prilohy', () => {
    //
    it('must not create a new item wihout auth', async () => {
      const data = Object.assign({}, p, {content: encContent})
      const res = await r.post(`/prilohy/${g.body1.id}`).send(data)
      res.should.have.status(401)
    })

    it('must not create a new item without mandatory item', async () => {
      const res = await r.post(`/prilohy/${g.body1.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item', async () => {
      const data = Object.assign({}, p, {content: encContent})
      const res = await r.post(`/prilohy/${g.body1.id}`).send(data)
        .set('Authorization', 'Bearer f')
      res.should.have.status(201)
      p.id = res.body[0]
      g.priloha1 = p
    })

    // it('shall update the item', async () => {
    //   const change = { osoba: 'frodo' }
    //   const res = await r.put(`/usneseni/${p.id}`).send(change)
    //     .set('Authorization', 'Bearer f')
    //   res.should.have.status(200)
    // })

    it('shall get all items', async () => {
      const res = await r.get(`/prilohy/${g.body1.id}`).set('Authorization', 'Bearer f')
      res.body[0].name.should.eql(p.name)
      res.should.have.status(200)
    })
  })
}
