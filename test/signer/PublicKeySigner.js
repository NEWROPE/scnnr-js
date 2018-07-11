import { expect } from 'chai'

import scnnr from '../../dist/scnnr.esm'

describe('PublicKeySigner', () => {
  const publicAPIKey = 'dummy-key'
  const signer = new scnnr.PublicKeySigner(publicAPIKey)

  describe('constructor', () => {
    it('should receive a public API key', () => {
      expect(signer.publicAPIKey).to.equal(publicAPIKey)
    })
  })

  describe('interceptRequest', () => {
    xit('sets x-api-key header')
  })
})
