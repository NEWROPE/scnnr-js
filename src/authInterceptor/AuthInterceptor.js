export default class AuthInterceptor {
  constructor() { this.interceptRequest = this.interceptRequest.bind(this) }

  interceptRequest(config) { return Promise.resolve(config) }
}
