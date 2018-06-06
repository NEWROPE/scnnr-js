import nock from 'nock'
import fs from 'fs'
import path from 'path'
import { Buffer } from 'buffer'
import { expect } from 'chai'
import XHRMock from 'xhr-mock'

import forbiddenErrorResponse from './fixtures/errors/forbidden_error.json'
import notFoundErrorResponse from './fixtures/errors/not_found_error.json'
import unprocessableEntityErrorResponse from './fixtures/errors/unprocessable_entity_error.json'
import tooManyRequestsErrorResponse from './fixtures/errors/too_many_requests_error.json'
import internalServerErrorResponse from './fixtures/errors/internal_server_error.json'

import { ScnnrAPIError } from '../src/errors'

import scnnr from '../dist/scnnr.esm'

describe('Connection', () => {
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/v1',
    apiKey: 'dummy_key',
  }
  const connection = new scnnr.Connection(config)
  const responseBody = { data: 'dummy_data' }

  const behavesLikeGenericRequest = (method, requestPath, sendRequest) => {
    it('resolves with response', () => {
      nock(config.url, { reqheaders: { 'x-api-key': config.apiKey } })[method](requestPath).reply(200, responseBody)

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

  const behavesLikeRequestWithAPIKey = (requestPath, sendRequest) => {
    it('sends x-api-key', () => {
      nock(config.url, { reqheaders: { 'x-api-key': config.apiKey } })
        .post(requestPath)
        .reply(200)
      return sendRequest(connection)
    })
  }

  const behavesLikeRequestWithProgress = (type, method, requestPath, sendRequest) => {
    describe('on a browser environment', () => {
      let onProgress
      const onProgressPromise = new Promise((resolve) => { onProgress = event => resolve(event) })

      const connection = new scnnr.Connection(Object.assign({
        [`on${type}Progress`]: onProgress,
      }, config))
      connection.httpClient.defaults.adapter = require('axios/lib/adapters/xhr')

      beforeEach(() => {
        XHRMock.setup()
        XHRMock[method](config.url + requestPath, (req, res) => res.status(200).body(responseBody))
      })
      afterEach(() => { XHRMock.teardown() })

      it(`can be work with on${type}Progress callback`, () => {
        return sendRequest(connection)
          .then(() => onProgressPromise)
          .then((event) => expect(event.type).to.equal('progress'))
      })
    })
  }

  const handlesErrors = (method, requestPath, sendRequest) => {
    const testCases = [
      {
        title: 'should handle 404 response',
        mockResponse: { status: 404, body: notFoundErrorResponse },
        expectations: {
          errorClass: ScnnrAPIError,
          errorMessage: '[Not Found] Recognition (ID: some-id) is not found. (not-found)',
          errorStatusCode: 404,
          errorTitle: 'Not Found',
          errorDetail: 'Recognition (ID: some-id) is not found.',
          errorType: 'not-found',
        },
      },
      {
        title: 'should handle 422 response',
        mockResponse: { status: 422, body: unprocessableEntityErrorResponse },
        expectations: {
          errorClass: ScnnrAPIError,
          errorMessage: '[Unprocessable Entity] image: unknown format (unprocessable-entity)',
          errorStatusCode: 422,
          errorTitle: 'Unprocessable Entity',
          errorDetail: 'image: unknown format',
          errorType: 'unprocessable-entity',
        },
      },
      {
        title: 'should handle 500 response',
        mockResponse: { status: 500, body: internalServerErrorResponse },
        expectations: {
          errorClass: ScnnrAPIError,
          errorMessage: '[Internal Server Error] Something bad happened (internal-server-error)',
          errorStatusCode: 500,
          errorTitle: 'Internal Server Error',
          errorDetail: 'Something bad happened',
          errorType: 'internal-server-error',
        },
      },
      // Special cases where response only contains message. (AWS API Gateway)
      {
        title: 'should handle 403 response',
        mockResponse: { status: 403, body: forbiddenErrorResponse },
        expectations: {
          errorClass: ScnnrAPIError,
          errorMessage: '[Forbidden] Request failed with status code 403',
          errorStatusCode: 403,
          errorTitle: 'Forbidden',
          errorDetail: 'Request failed with status code 403',
        },
      },
      {
        title: 'should handle 429 response',
        mockResponse: { status: 429, body: tooManyRequestsErrorResponse },
        expectations: {
          errorClass: ScnnrAPIError,
          errorMessage: '[Too Many Requests] Request failed with status code 429',
          errorStatusCode: 429,
          errorTitle: 'Too Many Requests',
          errorDetail: 'Request failed with status code 429',
        },
      },
    ]

    describe('error handling', () => {
      testCases.forEach(testCase => {
        it(testCase.title, () => {
          nock(config.url)
            .intercept(requestPath, method)
            .reply(testCase.mockResponse.status, testCase.mockResponse.body)

          return sendRequest(connection)
            .catch(err => {
              expect(err.name).to.be.equal('ScnnrAPIError')
              expect(err.message).to.be.equal(testCase.expectations.errorMessage)
              expect(err.statusCode).to.be.equal(testCase.expectations.errorStatusCode)
              expect(err.title).to.be.equal(testCase.expectations.errorTitle)
              expect(err.detail).to.be.equal(testCase.expectations.errorDetail)
              expect(err.type).to.be.equal(testCase.expectations.errorType)
            })
        })
      })
    })
  }

  describe('get', () => {
    const requestPath = '/recognitions/some/recognition-id'
    const sendRequest = (connection, options = {}) => connection.get(requestPath, {}, options)

    behavesLikeGenericRequest('get', requestPath, sendRequest)
    behavesLikeTimeoutableRequest('get', requestPath, sendRequest)
    behavesLikeRequestWithProgress('Download', 'get', requestPath, sendRequest)
    handlesErrors('get', requestPath, sendRequest)
  })

  describe('sendJson', () => {
    const requestPath = '/remote/recognitions'
    const requestBody = { data: 'dummy_data' }
    const sendRequest = (connection, options = {}) => connection.sendJson(requestPath, requestBody, options)

    behavesLikeGenericRequest('post', requestPath, sendRequest)
    behavesLikeRequestWithBody('post', requestPath, 'application/json', sendRequest)
    behavesLikeTimeoutableRequest('post', requestPath, sendRequest)
    behavesLikeRequestWithAPIKey(requestPath, sendRequest)
    behavesLikeRequestWithProgress('Download', 'post', requestPath, sendRequest)
    behavesLikeRequestWithProgress('Upload', 'post', requestPath, sendRequest)
    handlesErrors('post', requestPath, sendRequest)

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
    behavesLikeRequestWithAPIKey(requestPath, sendRequest)
    // TODO: Upgrade xhr-mock and fix these tests
    // behavesLikeRequestWithProgress('Download', 'post', requestPath, sendRequest)
    // behavesLikeRequestWithProgress('Upload', 'post', requestPath, sendRequest)
    handlesErrors('post', requestPath, sendRequest)

    it('sends binary-data', () => {
      nock(config.url, { reqheaders: { 'Content-Type': 'application/octet-stream' } })
        .post(requestPath)
        .reply(200, (uri, body) => { expect(body).to.equal(requestBody.toString('hex')) })

      return sendRequest(connection)
    })
  })
})
