/* global describe before after */
import chai from 'chai'
import temp from 'temp'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const g = require('./env/init')

describe('app', () => {
  before(done => {
    temp.track()
    temp.mkdir('testdata', async (err, dirPath) => {
      if (err) return done(err)
      process.env.SLOZKA_PRILOH = dirPath
      try {
        const InitModule = require('../index')
        g.InitApp(InitModule.default).then(app => {
          g.server = app.listen(g.port, '127.0.0.1', (err) => {
            if (err) return done(err)
            done()
          })
        }).catch(done)
      } catch(err) { done(err) }
    })
  })
  after(done => {
    temp.cleanup((err, stats) => {
      if (err) return done(err)
      console.log(stats)
      g.server.close()
      g.close()
      done()
    })
  })

  describe('API', () => {
    const submodules = [
      './jednani',
      './body',
      './usneseni',
      './prilohy',
      './hlasovani',
      './hlasy'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
