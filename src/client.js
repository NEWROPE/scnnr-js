import defaults from './client/defaults'
import Connection from './connection'

export default class Client {
  constructor(config) {
    this.config = Object.assign({}, defaults, config)
  }

  recognizeUrl(url, options = {}) {
    return this.connection(options).sendJson('/remote/recognitions', { url })
      .then(this.handleResponse)
  }

  recognizeImage(data, options = {}) {
    return this.connection(options).sendBinary('/recognitions', data)
      .then(this.handleResponse)
  }

  // TODO: remove eslint-disable-line
  fetch(id, options = {}) { // eslint-disable-line no-unused-vars

  }

  handleResponse(response) { return response.data }

  connection(options) { return new Connection(Object.assign({}, this.config, options)) }
}
