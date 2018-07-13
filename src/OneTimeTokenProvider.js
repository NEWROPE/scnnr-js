import Connection from './Connection'

export default class OneTimeTokenProvider {
  constructor(publicAPIKey, options) {
    this.publicAPIKey = publicAPIKey
    this.options = options
    this.token = null
    this.timeout = null
    this.marginToExpire = 0.05 // a margin to prevent unexpected expiration (5% of the time)
  }

  get() { return this.retrieve().then(() => this.getAndClearToken()) }

  retrieve() {
    if (this.token != null) { return Promise.resolve() }
    return this.issue().then(data => this.storeToken(data))
  }

  issue() {
    return Connection.build(true, Object.assign({}, this.options, { apiKey: this.publicAPIKey }))
      .sendJson('/auth/tokens', { type: 'one-time' })
      .then(response => response.data)
  }

  storeToken(data) {
    this.timeout = setTimeout(() => { this.token = null }, data.expires_in * (1 - this.marginToExpire) * 1000)
    this.token = data.value
  }

  getAndClearToken() {
    this.clearExpiration()
    const token = this.token
    this.token = null
    return token
  }

  clearExpiration() {
    if (this.timeout != null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}
