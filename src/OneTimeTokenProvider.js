import Connection from './Connection'
import { buildToken } from './token'

export default class OneTimeTokenProvider {
  constructor(publicAPIKey, options) {
    this.publicAPIKey = publicAPIKey
    this.options = options
    this.token = null
    this.timeout = null
    this.marginToExpire = 0.05 // a margin to prevent unexpected expiration (5% of the time)
  }

  get() { return this.issue().then(() => this.getAndClearToken()) }

  issue() {
    if (this.hasValidToken()) { return Promise.resolve() }
    return this.requestToken().then(token => { this.token = token })
  }

  requestToken() {
    return Connection.build(true, Object.assign({}, this.options, { apiKey: this.publicAPIKey }))
      .sendJson('/auth/tokens', { type: 'one-time' })
      .then(response => buildToken(response.data))
  }

  hasValidToken() {
    if (this.token == null) { return false }
    return !this.token.hasExpired(this.token.expiresIn * this.marginToExpire * 1000)
  }

  getAndClearToken() {
    const token = this.token
    this.token = null
    return token
  }
}
