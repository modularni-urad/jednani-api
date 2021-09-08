/* global describe it */
import moment from 'moment'
import _ from 'underscore'
import { ROLE } from '../consts'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  return describe('hlasy', () => {
    //
    it('must not create a new item wihout auth', async () => {
      const res = await r.post(`/hlasy/${g.hlasovani1.id}/a`)
      res.should.have.status(401)
    })

    // it('must not create a new item without approp group membership', async () => {
    //   const res = await r.post(`/hlasovani/?body=${g.body1.id}`)
    //     .set('Authorization', 'Bearer f')
    //   res.should.have.status(401)
    // })

    it('shall create a new item', async () => {
      // g.mockUser.groups = [ ROLE.ADMIN_HLASOVANI ]
      const res = await r.post(`/hlasy/${g.hlasovani1.id}/a`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('must not get my vote without auth', async () => {
      const res = await r.get(`/hlasy/${g.hlasovani1.id}`)
      res.should.have.status(401)
    })

    it('shall get my vote', async () => {
      const res = await r.get(`/hlasy/${g.hlasovani1.id}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    // it('shall get all items', async () => {
    //   const res = await r.get(`/hlasovani/?filter={"idbod":${g.body1.id}}`)
    //   res.body.should.have.length(1)
    //   res.should.have.status(200)
    // })
  })
}
