import BaseSigner from './BaseSigner'
import { PreconditionFailed } from '../errors'

function sanitizeAPIKey(key) {
  if (typeof key !== 'string') {
    return null
  }
  key = key.replace(/^\s*/, '').replace(/\s*$/, '')
  return key === '' ? null : key
}

export default class PrivateKeySigner extends BaseSigner {
  constructor(apiKey) {
    super()
    this.apiKey = sanitizeAPIKey(apiKey)
    if (this.apiKey == null) {
      throw new PreconditionFailed('`apiKey` configuration is required.')
    }
    this.interceptRequest = this.interceptRequest.bind(this)
  }

  interceptRequest(config) {
    return new Promise((resolve, reject) => {
      config.headers['x-api-key'] = this.apiKey
      resolve(config)
    })
  }
}
