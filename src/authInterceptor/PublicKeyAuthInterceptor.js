import Connection from '../Connection'
import AuthInterceptor from './AuthInterceptor'

export default class PublicKeyAuthInterceptor extends AuthInterceptor {
  constructor(publicAPIKey, options) {
    super()
    this.publicAPIKey = publicAPIKey
    this.options = options
    this.marginToExpire = 0.05 // a margin to prevent unexpected expiration (5% of the time)
  }

  interceptRequest(config) {
    return this.getOneTimeToken()
      .then(token => {
        config.headers['x-api-key'] = 'use-scnnr-one-time-token'
        config.headers['x-scnnr-one-time-token'] = token
        return config
      })
  }

  getOneTimeToken() {
    return this.retrieveOneTimeToken()
      .then(() => {
        const token = this.oneTimeToken
        delete this.oneTimeToken
        return token
      })
  }

  retrieveOneTimeToken() {
    if (this.oneTimeToken != null) {
      return Promise.resolve()
    }
    return this.issueOneTimeToken()
      .then(data => this.storeOneTimeToken(data))
  }

  issueOneTimeToken() {
    return Connection.build(true, Object.assign({}, this.options, { apiKey: this.publicAPIKey }))
      .sendJson('/auth/tokens', { type: 'one-time' })
      .then(response => response.data)
  }

  storeOneTimeToken(data) {
    setTimeout(() => { delete this.oneTimeToken }, data.expires_in * (1 - this.marginToExpire) * 1000)
    this.oneTimeToken = data.value
  }
}
