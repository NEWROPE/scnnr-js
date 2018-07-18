import nock from 'nock'
import sinon from 'sinon'
import { expect } from 'chai'

import scnnr from '../../dist/scnnr.esm'

describe('PublicKeyAuthInterceptor', () => {
  const options = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: 'v1'
  }
  const publicAPIKey = 'dummy-public-key'
  const oneTimeToken = 'this-is-one-time-token'

  const tokenResponseBody = {
    'expires_in': 900,
    'scopes': ['recognitions'],
    'type': 'one-time',
    'value': oneTimeToken,
  }

  function getInterceptor() { return new scnnr.PublicKeyAuthInterceptor(publicAPIKey, options) }

  describe('constructor', () => {
    it('should have oneTimeTokenProvider with the provided publicAPIKey and options', () => {
      const interceptor = getInterceptor()
      expect(interceptor.oneTimeTokenProvider.publicAPIKey).to.equal(publicAPIKey)
      expect(interceptor.oneTimeTokenProvider.options).to.equal(options)
    })
  })

  describe('interceptRequest', () => {
    it('sets x-api-key and x-scnnr-one-time-token headers', () => {
      const config = { headers: {} }
      const interceptor = getInterceptor()
      interceptor.oneTimeTokenProvider.token = scnnr.buildToken(tokenResponseBody)
      return interceptor.interceptRequest(config)
        .then(config => {
          expect(config.headers['x-api-key']).to.equal('use-scnnr-one-time-token')
          expect(config.headers['x-scnnr-one-time-token']).to.equal(oneTimeToken)
        })
    })
  })
})
