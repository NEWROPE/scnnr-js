import AuthInterceptor from './AuthInterceptor'

export default class PrivateKeyAuthInterceptor extends AuthInterceptor {
  constructor(apiKey) {
    super()
    this.apiKey = apiKey
  }

  interceptRequest(config) {
    return new Promise((resolve) => {
      config.headers['x-api-key'] = this.apiKey
      resolve(config)
    })
  }
}
