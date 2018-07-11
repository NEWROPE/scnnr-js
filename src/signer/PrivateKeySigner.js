import BaseSigner from './BaseSigner'

export default class PrivateKeySigner extends BaseSigner {
  constructor(apiKey) {
    super()
    this.apiKey = apiKey
    this.interceptRequest = this.interceptRequest.bind(this)
  }

  interceptRequest(config) {
    return new Promise((resolve, reject) => {
      config.headers['x-api-key'] = this.apiKey
      resolve(config)
    })
  }
}