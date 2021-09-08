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
    organ: 'pok1',
    datum: moment().add(1, 'month'),
    misto: 'kancl'
  }

  return describe('jednani', () => {
    //
    it('must not create a new item wihout auth', async () => {
      const res = await r.post('/jednani/').send(p)
      res.should.have.status(401)
    })

    it('must not create a new item without mandatory item', async () => {
      g.mockUser.groups = [ ROLE.ADMIN_JEDNANI ]
      const res = await r.post('/jednani/').send(_.omit(p, 'misto'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item pok1', async () => {
      const res = await r.post('/jednani/').send(p).set('Authorization', 'Bearer f')
      res.should.have.status(201)
      res.should.have.header('content-type', /^application\/json/)
      p.id = res.body[0]
      g.jednani = p
    })

    it('shall update the item pok1', async () => {
      const change = {
        misto: 'matrika'
      }
      const res = await r.put(`/jednani/${p.id}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the pok1', async () => {
      const res = await r.get('/jednani/' + p.id)
      res.body.misto.should.eql('matrika')
      res.should.have.status(200)
    })

    it('shall list with paginate', async () => {
      const res = await r.get('/jednani/').query({ currentPage: 1, perPage: 2 })
      // res.body.length.should.eql(1)
      // res.body[0].name.should.eql('pok1changed')
      res.should.have.status(200)
    })
  })
}
