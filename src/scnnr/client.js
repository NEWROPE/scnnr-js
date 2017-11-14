import defaults from './client/defaults'
import Connection from './client/connection'

export default class Client {
  constructor(config) {
    this.config = Object.assign({}, defaults, config)
  }

  // TODO: remove eslint-disable-line
  recognizeUrl(url, options = {}) { // eslint-disable-line no-unused-vars
    return this.connection(options).sendJson('/remote/recognitions', { url })
      .then(this.handleResponse)
  }

  // TODO: remove eslint-disable-line
  recognizeImg(imageFile, options = {}) { // eslint-disable-line no-unused-vars

  }

  // TODO: remove eslint-disable-line
  fetch(id, options = {}) { // eslint-disable-line no-unused-vars

  }

  handleResponse(response) { return response.data }

  connection(options) { return new Connection(Object.assign({}, this.config, options)) }
}
Client.Connection = Connection
