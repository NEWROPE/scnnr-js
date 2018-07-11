import Connection from '../Connection'
import BaseSigner from './BaseSigner'

export default class PublicKeySigner extends BaseSigner {
  constructor(publicAPIKey, options) {
    super()
    this.publicAPIKey = publicAPIKey
    this.options = options
    this.interceptRequest = this.interceptRequest.bind(this)
    this.marginToExpire = 0.05 // a margin to prevent unexpected expiration (5% of the time)
  }

  interceptRequest(config) {
    return new Promise((resolve, reject) => {
      // TODO: implement
      resolve(config)
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
    return Connection.build(true, Object.assign({ apiKey: this.publicAPIKey }, this.options))
      .sendJson('/auth/tokens', { type: 'one-time' })
      .then(response => response.data)
  }

  storeOneTimeToken(data) {
    setTimeout(() => { delete this.oneTimeToken }, data.expires_in * (1 - this.marginToExpire) * 1000)
    this.oneTimeToken = data.value
  }
}
