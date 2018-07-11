import nock from 'nock'
import sinon from 'sinon'
import { expect } from 'chai'

import scnnr from '../../dist/scnnr.esm'

describe('PublicKeySigner', () => {
  const options = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: 'v1'
  }
  const publicAPIKey = 'dummy-key'
  const oneTimeToken = 'this-is-one-time-token'

  const tokenResponseBody = {
    'expires_in': 900,
    'scopes': ['recognitions'],
    'type': 'one-time',
    'value': oneTimeToken,
  }

  function getSigner() { return new scnnr.PublicKeySigner(publicAPIKey, options) }

  describe('constructor', () => {
    it('should receive a public API key', () => {
      expect(getSigner().publicAPIKey).to.equal(publicAPIKey)
    })
  })

  describe('interceptRequest', () => {
    xit('sets x-api-key header')
  })

  describe('getOneTimeToken', () => {
    it('returns a one-time-token and remove it from cache', () => {
      const signer = getSigner()
      signer.storeOneTimeToken(tokenResponseBody)
      return signer.getOneTimeToken()
        .then(token => expect(token).to.equal(oneTimeToken))
        .then(() => expect(signer.oneTimeToken).to.be.undefined)
    })
  })

  describe('retrieveOneTimeToken', () => {
    context('when a one-time-token is not cached', () => {
      it('issues a token and cache it', () => {
        nock(options.url + options.version, { reqheaders: { 'x-api-key': publicAPIKey } })
          .post('/auth/tokens', JSON.stringify({ type: 'one-time' }))
          .reply(200, tokenResponseBody)
        const signer = getSigner()
        return signer.retrieveOneTimeToken()
          .then(result => expect(result).to.be.undefined)
          .then(() => expect(signer.oneTimeToken).to.equal(oneTimeToken))
      })
    })

    context('when a one-time-token is already cached', () => {
      it('does nothing', () => {
        const signer = getSigner()
        signer.storeOneTimeToken(tokenResponseBody)
        return signer.retrieveOneTimeToken()
          .then(result => expect(result).to.be.undefined)
          .then(() => expect(signer.oneTimeToken).to.equal(oneTimeToken))
      })
    })

    describe('about token expiration', () => {
      let clock
      before(() => clock = sinon.useFakeTimers())
      after(() => clock.restore())

      it('reserves to delete the cache', () => {
        const signer = getSigner()
        signer.storeOneTimeToken(tokenResponseBody)
        return signer.retrieveOneTimeToken()
          .then(() => expect(signer.oneTimeToken).to.equal(oneTimeToken))
          .then(() => clock.tick(tokenResponseBody.expires_in * (1 - signer.marginToExpire) * 1000))
          .then(() => expect(signer.oneTimeToken).to.be.undefined)
      })
    })
  })

  describe('issueOneTimeToken', () => {
    it('calls an API to issue a one-time-token and returns the response data', () => {
      nock(options.url + options.version, { reqheaders: { 'x-api-key': publicAPIKey } })
        .post('/auth/tokens', JSON.stringify({ type: 'one-time' }))
        .reply(200, tokenResponseBody)

      return getSigner().issueOneTimeToken()
        .then(data => expect(data).to.deep.equal(tokenResponseBody))
    })
  })
})
