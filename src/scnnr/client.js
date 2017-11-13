import defaults from './client/defaults'
import Connection from './client/connection'

export default class Client {
  constructor(config) {
    this.config = Object.assign({}, defaults, config)

    this.connection = new Connection(this.config)
  }

  recognizeUrl(url, options = {}) {
    return this.connection.sendJson('/remote/recognitions', { url })
  }

  recognizeImg(imageFile, options = {}) {

  }

  fetch(id, options = {}) {

  }
}
