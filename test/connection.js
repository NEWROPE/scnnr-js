import nock from 'nock'
import fs from 'fs'
import path from 'path'
import { Buffer } from 'buffer'
import { expect } from 'chai'

import scnnr from '../dist/scnnr.esm'

const Connection = scnnr.Connection

describe('Connection', () => {
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: 'v1',
    apiKey: 'dummy_key'
  }
  const connection = new Connection(config)
  const responseBody = { data: 'dummy_data' }

  const behavesLikeGenericRequest = (method, requestPath, contentType, sendRequest) => {
    it('sends Content-Type header', () => {
      nock(config.url, { reqheaders: { 'Content-Type': contentType } })[method](`/${config.version}${requestPath}`)
        .reply(200)

      return sendRequest
    })
  }

  const behavesLikeTimeoutableRequest = (method, requestPath, sendRequest) => {
    it('sends timeout parameter', () => {
      const timeout = { timeout: 1 }
      const timeoutConnection = new Connection(Object.assign({}, config, timeout))

      nock(config.url)[method](`/${config.version}/${requestPath}`).query(timeout).reply(200)

      return sendRequest
    })
  }

  const behavesLikePOSTRequest = (requestPath, sendRequest) => {
    it('sends x-api-key', () => {
      nock(config.url, { reqheaders: { 'x-api-key': config.apiKey } })
        .post(`/${config.version}/${requestPath}`)
        .reply(200)
      return sendRequest
    })
  }

  describe('sendJson', () => {
    const requestPath = '/remote/recognitions'
    const requestBody = { data: 'dummy_data' }
    const sendRequest = () => connection.sendJson(requestPath, requestBody)

    behavesLikeGenericRequest('post', requestPath, 'application/json', sendRequest)
    behavesLikeTimeoutableRequest('post', requestPath, sendRequest)
    behavesLikePOSTRequest(requestPath, sendRequest)

    it('sends json body', () => {
      nock(config.url).post(`/${config.version}${requestPath}`, requestBody).reply(200)

      return sendRequest()
    })

    it('resolves with response', () => {
      nock(config.url).post(`/${config.version}${requestPath}`).reply(200, responseBody)

      return sendRequest()
        .then(result => {
          expect(result.status).to.equal(200)
          expect(result.data).to.deep.equal(responseBody)
        })
    })
  })

  describe('sendBinary', () => {
    const requestPath = '/recognitions'
    const requestBody = fs.readFileSync(path.join(__dirname, './fixtures/images/sample.png'))
    const sendRequest = () => connection.sendBinary(requestPath, requestBody)

    behavesLikeGenericRequest('post', requestPath, 'application/octet-stream', sendRequest)
    behavesLikeTimeoutableRequest('post', requestPath, sendRequest)
    behavesLikePOSTRequest(requestPath, sendRequest)

    it('sends binary-data', () => {
      nock(config.url, { reqheaders: { 'Content-Type': 'application/octet-stream' } })
        .post(`/${config.version}${requestPath}`)
        .reply(200, (uri, body) => { expect(body).to.equal(requestBody.toString('hex')) })

      return sendRequest()
    })

    it('resolves with response', () => {
      nock(config.url).post(`/${config.version}${requestPath}`).reply(200, responseBody)

      return sendRequest()
        .then(result => {
          expect(result.status).to.equal(200)
          expect(result.data).to.deep.equal(responseBody)
        })
    })
  })

  describe('hasKey', () => {
    it('is set false when apiKey is not string', () => {
      const connection = new Connection({ apiKey: null })
      expect(connection.hasKey).to.be.false
    })

    it('is set true when apiKey is empty string', () => {
      const connection = new Connection({ apiKey: '  ' })
      expect(connection.hasKey).to.be.false
    })

    it('is set true when apiKey is non-empty string', () => {
      const connection = new Connection({ apiKey: 'some-key' })
      expect(connection.hasKey).to.be.true
    })
  })
})
