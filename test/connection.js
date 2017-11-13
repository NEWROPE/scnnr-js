import chai from 'chai'
import nock from 'nock'

import Scnnr from '../dist/scnnr.esm'

const should = chai.should()
const Connection = Scnnr.Client.Connection

describe('Connection', () => {
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: 'v1',
    key: 'dummy_key'
  }
  const testConnection = new Connection(config)
  const versionPath = `/${config.version}/`

  describe('sendJson', () => {
    const testData = { data: 'dummy_data' }

    it('sends x-api-key', () => {
      nock(config.url, { reqheaders: { 'x-api-key': config.key } }).post(versionPath).reply(200)

      return testConnection.sendJson('/', '')
    })

    it('sends application/json header', () => {
      nock(config.url, { reqheaders: { 'Content-Type': 'application/json' } }).post(versionPath).reply(200)

      return testConnection.sendJson('/', '')
    })

    it('sends timeout parameter', () => {
      const timeout = { timeout: 1 }
      const timeoutConfig = Object.assign({}, config, timeout)
      const timeoutConnection = new Connection(timeoutConfig)

      nock(config.url).post(versionPath).query(timeout).reply(200)

      return timeoutConnection.sendJson('/', '')
    })

    it('sends json body', () => {
      nock(config.url).post(versionPath, testData).reply(200)

      return testConnection.sendJson('/', testData)
    })

    it('resolves with json body', () => {
      nock(config.url).post(versionPath).reply(200, testData)

      return testConnection.sendJson('/', '')
        .then( result => {
          result.should.eql(testData)
        })
    })
  })

})
