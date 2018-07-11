import nock from 'nock'
import { expect } from 'chai'

import scnnr from '../../dist/scnnr.esm'

describe('PublicKeySigner', () => {
  const options = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: 'v1'
  }
  const publicAPIKey = 'dummy-key'
  const signer = new scnnr.PublicKeySigner(publicAPIKey, options)

  describe('constructor', () => {
    it('should receive a public API key', () => {
      expect(signer.publicAPIKey).to.equal(publicAPIKey)
    })
  })

  describe('interceptRequest', () => {
    xit('sets x-api-key header')
  })

  describe('retrieveOneTimeToken', () => {
    const responseBody = {
      'expires_in': 900,
      'scopes': ['recognitions'],
      'type': 'one-time',
      'value': 'this-is-one-time-token',
    }

    it('returns a one-time-token', () => {
      nock(options.url + options.version, { reqheaders: { 'x-api-key': publicAPIKey } })
        .post('/auth/tokens', JSON.stringify({ type: 'one-time' }))
        .reply(200, responseBody)

      return signer.retrieveOneTimeToken()
        .then(data => expect(data).to.deep.equal(responseBody))
    })
  })
})
