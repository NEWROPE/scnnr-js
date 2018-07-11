import BaseSigner from './BaseSigner'

export default class PublicKeySigner extends BaseSigner {
  constructor(publicAPIKey) {
    super()
    this.publicAPIKey = publicAPIKey
    this.interceptRequest = this.interceptRequest.bind(this)
  }

  interceptRequest(config) {
    return new Promise((resolve, reject) => {
      // TODO: implement
      resolve(config)
    })
  }
}
