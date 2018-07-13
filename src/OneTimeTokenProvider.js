import Connection from './Connection'

export default class OneTimeTokenProvider {
  constructor() {
    this.token = null
    this.marginToExpire = 0.05 // a margin to prevent unexpected expiration (5% of the time)
  }

  get(options) {
    return this.retrieve(options)
      .then(() => {
        const token = this.token
        this.token = null
        return token
      })
  }

  retrieve(options) {
    if (this.token != null) {
      return Promise.resolve()
    }
    return this.issue(options)
      .then(data => this.storeToken(data))
  }

  issue(options) {
    return Connection.build(true, Object.assign({}, options, { apiKey: options.publicAPIKey }))
      .sendJson('/auth/tokens', { type: 'one-time' })
      .then(response => response.data)
  }

  storeToken(data) {
    setTimeout(() => { this.token = null }, data.expires_in * (1 - this.marginToExpire) * 1000)
    this.token = data.value
  }
}
