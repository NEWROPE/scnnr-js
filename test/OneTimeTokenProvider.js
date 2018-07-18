import nock from 'nock'
import sinon from 'sinon'
import { expect } from 'chai'

import scnnr from '../dist/scnnr.esm'

describe('OneTimeTokenProvider', () => {
  const publicAPIKey = 'dummy-public-key'
  const options = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: 'v1',
  }
  const provider = new scnnr.OneTimeTokenProvider(publicAPIKey, options)
  const oneTimeToken = 'this-is-one-time-token'
  const tokenResponseBody = {
    'expires_in': 900,
    'scopes': ['recognitions'],
    'type': 'one-time',
    'value': oneTimeToken,
  }

  describe('get', () => {
    before(() => provider.token = scnnr.buildToken(tokenResponseBody))

    it('returns a one-time-token and remove it from cache', () => {
      return provider.get(options)
        .then(token => {
          expect(token.value).to.equal(oneTimeToken)
          expect(provider.token).to.be.null
        })
    })
  })

  describe('issue', () => {
    context('when a one-time-token is not cached', () => {
      it('issues a token and cache it', () => {
        nock(options.url + options.version, { reqheaders: { 'x-api-key': publicAPIKey } })
          .post('/auth/tokens', JSON.stringify({ type: 'one-time' }))
          .reply(200, tokenResponseBody)
        return provider.issue(options)
          .then(result => {
            expect(result).to.be.undefined
            expect(provider.token.value).to.equal(oneTimeToken)
          })
      })
    })

    context('when a one-time-token is already cached', () => {
      const previousResponse = Object.assign({}, tokenResponseBody, { value: 'previous-token' })
      before(() => provider.token = scnnr.buildToken(previousResponse))

      it('does nothing', () => {
        return provider.issue(options)
          .then(result => {
            expect(result).to.be.undefined
            expect(provider.token.value).to.equal(previousResponse.value)
          })
      })
    })

    describe('after expiration of a previous token', () => {
      const previousResponse = Object.assign({}, tokenResponseBody, { value: 'previous-token' })

      let clock
      before(() => {
        clock = sinon.useFakeTimers()
        provider.token = scnnr.buildToken(previousResponse)
      })
      after(() => clock.restore())

      it('clears the cache and issues a new token', () => {
        clock.tick(previousResponse.expires_in * (1 - provider.marginToExpire) * 1000)
        nock(options.url + options.version, { reqheaders: { 'x-api-key': publicAPIKey } })
          .post('/auth/tokens', JSON.stringify({ type: 'one-time' }))
          .reply(200, tokenResponseBody)
        return provider.issue(options)
          .then(() => {
            expect(provider.token.value).to.equal(oneTimeToken)
          })
      })
    })
  })

  describe('requestToken', () => {
    it('calls an API to issue a one-time-token and returns the response data', () => {
      nock(options.url + options.version, { reqheaders: { 'x-api-key': publicAPIKey } })
        .post('/auth/tokens', JSON.stringify({ type: 'one-time' }))
        .reply(200, tokenResponseBody)

      return provider.requestToken(options).then(token => {
        expect(token).to.be.an.instanceof(scnnr.OneTimeToken)
        expect(token.value).to.deep.equal(tokenResponseBody.value)
      })
    })
  })
})
