import defaults from './client/defaults'
import Connection from './client/connection'

export default class Client {
  constructor(config) {
    this.config = Object.assign({}, defaults, config)

    this.connection = new Connection(this.config)
  }

  // TODO: remove eslint-disable-line
  recognizeUrl(url, options = {}) { // eslint-disable-line no-unused-vars
    return this.connection.sendJson('/remote/recognitions', { url })
  }

  // TODO: remove eslint-disable-line
  recognizeImg(imageFile, options = {}) { // eslint-disable-line no-unused-vars

  }

  // TODO: remove eslint-disable-line
  fetch(id, options = {}) { // eslint-disable-line no-unused-vars

  }
}
Client.Connection = Connection
