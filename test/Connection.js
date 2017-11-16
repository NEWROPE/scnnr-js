import nock from 'nock'
import fs from 'fs'
import path from 'path'
import { Buffer } from 'buffer'
import { expect } from 'chai'

import scnnr from '../dist/scnnr.esm'

describe('Connection', () => {
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/v1',
    apiKey: 'dummy_key'
  }
  const connection = new scnnr.Connection(config)
  const responseBody = { data: 'dummy_data' }

  const behavesLikeGenericRequest = (method, requestPath, sendRequest) => {
    it('resolves with response', () => {
      nock(config.url)[method](requestPath).reply(200, responseBody)

      return sendRequest(connection)
        .then(result => {
          expect(result.status).to.equal(200)
          expect(result.data).to.deep.equal(responseBody)
        })
    })
  }

  const behavesLikeRequestWithBody = (method, requestPath, contentType, sendRequest) => {
    it('sends Content-Type header', () => {
      nock(config.url, { reqheaders: { 'Content-Type': contentType } })[method](requestPath)
        .reply(200)

      return sendRequest(connection)
    })
  }

  const behavesLikeTimeoutableRequest = (method, requestPath, sendRequest) => {
    it('sends timeout parameter', () => {
      const timeout = { params: { timeout: 1 } }
      const timeoutConnection = new scnnr.Connection(Object.assign({}, config, timeout))

      nock(config.url)[method](requestPath).query(timeout.params).reply(200)

      return sendRequest(timeoutConnection)
    })
  }

  const behavesLikePOSTRequest = (requestPath, sendRequest) => {
    it('sends x-api-key', () => {
      nock(config.url, { reqheaders: { 'x-api-key': config.apiKey } })
        .post(requestPath)
        .reply(200)
      return sendRequest(connection)
    })
  }

  describe('get', () => {
    const requestPath = '/recognitions/some/recognition-id'
    const sendRequest = (connection, options = {}) => connection.get(requestPath, {}, options)

    behavesLikeGenericRequest('get', requestPath, sendRequest)
    behavesLikeTimeoutableRequest('get', requestPath, sendRequest)
  })

  describe('sendJson', () => {
    const requestPath = '/remote/recognitions'
    const requestBody = { data: 'dummy_data' }
    const sendRequest = (connection, options = {}) => connection.sendJson(requestPath, requestBody, options)

    behavesLikeGenericRequest('post', requestPath, sendRequest)
    behavesLikeRequestWithBody('post', requestPath, 'application/json', sendRequest)
    behavesLikeTimeoutableRequest('post', requestPath, sendRequest)
    behavesLikePOSTRequest(requestPath, sendRequest)

    it('sends json body', () => {
      nock(config.url).post(requestPath, requestBody).reply(200)

      return sendRequest(connection)
    })
  })

  describe('sendBinary', () => {
    const requestPath = '/recognitions'
    const requestBody = fs.readFileSync(path.join(__dirname, './fixtures/images/sample.png'))
    const sendRequest = (connection, options = {}) => connection.sendBinary(requestPath, requestBody, options)

    behavesLikeGenericRequest('post', requestPath, sendRequest)
    behavesLikeRequestWithBody('post', requestPath, 'application/octet-stream', sendRequest)
    behavesLikeTimeoutableRequest('post', requestPath, sendRequest)
    behavesLikePOSTRequest(requestPath, sendRequest)

    it('sends binary-data', () => {
      nock(config.url, { reqheaders: { 'Content-Type': 'application/octet-stream' } })
        .post(requestPath)
        .reply(200, (uri, body) => { expect(body).to.equal(requestBody.toString('hex')) })

      return sendRequest(connection)
    })
  })
})
