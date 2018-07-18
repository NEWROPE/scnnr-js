import sinon from 'sinon'
import { expect } from 'chai'

import scnnr from '../../dist/scnnr.esm'

describe('token', () => {
  describe('buildToken', () => {
    context('the type is one-time', () => {
      let clock
      beforeEach(() => clock = sinon.useFakeTimers())
      afterEach(() => clock.restore())

      const data = {
        'expires_in': 900,
        'scopes': ['recognitions'],
        'type': 'one-time',
        'value': 'this-is-one-time-token',
      }

      it('returns a OneTimeToken instance instantiated by the provided data', () => {
        const token = scnnr.buildToken(data)
        expect(token).to.be.an.instanceof(scnnr.OneTimeToken)
        expect(token.value).to.eq(data.value)
        expect(token.expiresIn).to.eq(data.expires_in)
        expect(token.expiresAt.getTime() - Date.now()).to.eq(data.expires_in * 1000)
      })
    })

    context('the type is unknown', () => {
      const data = {
        'type': 'unknown-type',
        'value': 'this-is-unknown-type-token',
      }

      it('returns null', () => {
        const token = scnnr.buildToken(data)
        expect(token).to.be.null
      })
    })
  })
})
