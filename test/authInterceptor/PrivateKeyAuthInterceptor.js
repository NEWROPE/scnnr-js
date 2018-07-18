import { expect } from 'chai'

import scnnr from '../../dist/scnnr.esm'

describe('PrivateKeyAuthInterceptor', () => {
  const apiKey = 'dummy-key'
  const interceptor = new scnnr.PrivateKeyAuthInterceptor(apiKey)

  describe('constructor', () => {
    it('should receive an API key', () => {
      expect(interceptor.apiKey).to.equal(apiKey)
    })
  })

  describe('interceptRequest', () => {
    it('sets x-api-key header', () => {
      return interceptor.interceptRequest({ headers: {} })
        .then((config) => expect(config.headers['x-api-key']).to.equal(apiKey))
    })
  })
})
