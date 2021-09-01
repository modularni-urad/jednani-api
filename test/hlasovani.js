/* global describe it */
import moment from 'moment'
import _ from 'underscore'
import { ROLE } from '../consts'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  return describe('hlasovani', () => {
    //
    it('musi zaradit bod na jednani a vytvorit hlasovani', async () => {
      g.mockUser.id = 42
      const res = await r.put(`/body/${g.body1.id}/zaradit/${g.jednani.id}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)

      const res2 = await r.get(`/hlasovani/?filter={"idbod":${g.body1.id}}`)
      res2.should.have.status(200)
      res2.body.should.have.length(1)
      
      const res3 = await r.get(`/usneseni/?filter={"idhlasovani":${res2.body[0].id}}`)
      res3.should.have.status(200)
      res3.body.should.have.length(1)
    })

    it('must not create a new item wihout auth', async () => {
      g.mockUser.groups = []
      const res = await r.post(`/hlasovani/?body=${g.body1.id}`)
      res.should.have.status(401)
    })

    it('must not create a new item without approp group membership', async () => {
      const res = await r.post(`/hlasovani/?body=${g.body1.id}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(401)
    })

    it('shall create a new item', async () => {
      g.mockUser.groups = [ ROLE.ADMIN_HLASOVANI ]
      const res = await r.post(`/hlasovani/?body=${g.body1.id}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(201)
    })

    it('shall get all items', async () => {
      const res = await r.get(`/hlasovani/?filter={"idbod":${g.body1.id}}`)
      res.should.have.status(200)
      g.hlasovani1 = res.body[0]
      res.body.should.have.length(2)
    })
  })
}
