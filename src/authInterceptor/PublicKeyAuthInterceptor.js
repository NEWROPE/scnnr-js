import Connection from '../Connection'
import OneTimeTokenProvider from '../OneTimeTokenProvider'
import AuthInterceptor from './AuthInterceptor'

export default class PublicKeyAuthInterceptor extends AuthInterceptor {
  constructor(publicAPIKey, options) {
    super()
    this.oneTimeTokenProvider = new OneTimeTokenProvider(publicAPIKey, options)
  }

  interceptRequest(config) {
    return this.oneTimeTokenProvider.get()
      .then(token => {
        config.headers['x-api-key'] = 'use-scnnr-one-time-token'
        config.headers['x-scnnr-one-time-token'] = token.value
        return config
      })
  }
}
