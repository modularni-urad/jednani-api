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
    nazev: 'pok',
    duvod: 'pokusny bod jednani',
    predkl: 'gandalf',
    zprac: 'boromir,frodo'
  }

  return describe('body', () => {
    //
    it('must not create a new item wihout auth', async () => {
      g.mockUser.groups = []
      const res = await r.post('/body/').send(p)
      res.should.have.status(401)
    })

    it('must not create a new item without mandatory item', async () => {
      g.mockUser.groups = [ ROLE.ADMIN_BODY ]
      const res = await r.post('/body/').send(_.omit(p, 'nazev'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item pok1', async () => {
      const res = await r.post('/body/').send(p).set('Authorization', 'Bearer f')
      res.should.have.status(201)
      res.should.have.header('content-type', /^application\/json/)
      p.id = res.body[0]
      g.body1 = p
    })

    it('shall update the item pok1', async () => {
      const change = { predkl: g.mockUser.id }
      const res = await r.put(`/body/${p.id}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })
    // idjendnani: g.jednani.id,

    it('shall get the pok1', async () => {
      const res = await r.get('/body/' + p.id)
      res.body.predkl.should.eql(g.mockUser.id.toString())
      res.should.have.status(200)
    })

    it('shall list with paginate', async () => {
      const res = await r.get('/body/').query({ currentPage: 1, perPage: 2 })
      // res.body.length.should.eql(1)
      // res.body[0].name.should.eql('pok1changed')
      res.should.have.status(200)
    })

    it('nesmi zaradit bod na jednani, neni predkladatel', async () => {
      g.mockUser.id = 44
      const res = await r.put(`/body/${p.id}/zaradit/${g.jednani.id}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('musi zaradit bod na jednani', async () => {
      g.mockUser.id = 42
      const res = await r.put(`/body/${p.id}/zaradit/${g.jednani.id}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })
  })
}
