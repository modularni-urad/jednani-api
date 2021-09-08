/* global describe it */
import moment from 'moment'
import _ from 'underscore'
import { ROLE } from '../consts'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const p = {
    akce: 'poveruje',
    osoba: 'gandalf',
    text: 'k boji proti sarumanovi'
  }

  return describe('usneseni', () => {
    //
    it('must not create a new item wihout auth', async () => {
      g.mockUser.groups = []
      const res = await r.post(`/usneseni/${g.body1.id}`).send(p)
      res.should.have.status(401)
    })

    it('must not create a new item without mandatory item', async () => {
      g.mockUser.groups = [ ROLE.ADMIN_BODY ]
      const res = await r.post(`/usneseni/${g.body1.id}`).send(_.omit(p, 'akce'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item', async () => {
      const res = await r.post(`/usneseni/${g.body1.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(201)
      res.should.have.header('content-type', /^application\/json/)
      p.id = res.body[0]
      g.usneseni1 = p
    })

    it('shall update the item', async () => {
      const change = { osoba: 'frodo' }
      const res = await r.put(`/usneseni/${p.id}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get all items', async () => {
      const res = await r.get(`/usneseni/?filter={"idbod":${g.body1.id}}`)
      res.body[0].osoba.should.eql('frodo')
      res.should.have.status(200)
    })
  })
}
