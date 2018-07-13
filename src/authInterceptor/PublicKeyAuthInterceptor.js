import Connection from '../Connection'
import OneTimeTokenProvider from '../OneTimeTokenProvider'
import AuthInterceptor from './AuthInterceptor'

export default class PublicKeyAuthInterceptor extends AuthInterceptor {
  constructor(publicAPIKey, options) {
    super()
    this.options = Object.assign({}, options, { apiKey: publicAPIKey })
    this.oneTimeTokenProvider = new OneTimeTokenProvider()
  }

  interceptRequest(config) {
    return this.oneTimeTokenProvider.get(this.options)
      .then(token => {
        config.headers['x-api-key'] = 'use-scnnr-one-time-token'
        config.headers['x-scnnr-one-time-token'] = token
        return config
      })
  }
}
