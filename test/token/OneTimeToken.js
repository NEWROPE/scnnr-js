import sinon from 'sinon'
import { expect } from 'chai'

import scnnr from '../../dist/scnnr.esm'

describe('OneTimeToken', () => {
  describe('hasExpired', () => {
    const data = {
      'expires_in': 900,
      'scopes': ['recognitions'],
      'type': 'one-time',
      'value': 'this-is-one-time-token',
    }

    let clock
    let token
    beforeEach(() => {
      clock = sinon.useFakeTimers()
      token = scnnr.buildToken(data)
    })
    afterEach(() => clock.restore())

    it('returns whether the token has expired or not', () => {
      expect(token.hasExpired()).to.be.false
      clock.tick(data.expires_in * 1000 - 1)
      expect(token.hasExpired()).to.be.false
      clock.tick(1)
      expect(token.hasExpired()).to.be.true
    })

    describe('margin argument', () => {
      const margin = 1000

      it('is a margin to calculate expiration more safer', () => {
        expect(token.hasExpired(margin)).to.be.false
        clock.tick(data.expires_in * 1000 - 1 - margin)
        expect(token.hasExpired(margin)).to.be.false
        clock.tick(1)
        expect(token.hasExpired(margin)).to.be.true
      })
    })
  })
})
