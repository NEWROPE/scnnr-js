import Connection from '../Connection'
import BaseSigner from './BaseSigner'

export default class PublicKeySigner extends BaseSigner {
  constructor(publicAPIKey, options) {
    super()
    this.publicAPIKey = publicAPIKey
    this.options = options
    this.interceptRequest = this.interceptRequest.bind(this)
  }

  interceptRequest(config) {
    return new Promise((resolve, reject) => {
      // TODO: implement
      resolve(config)
    })
  }

  retrieveOneTimeToken() {
    return Connection.build(true, Object.assign({ apiKey: this.publicAPIKey }, this.options))
      .sendJson('/auth/tokens', { type: 'one-time' })
      .then(response => response.data)
  }
}
