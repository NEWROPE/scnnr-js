import defaults from './client/defaults'
import Connection from './Connection'
import Recognition from './Recognition'

function sanitizeAPIKey(key) {
  if (typeof key !== 'string') {
    return null
  }
  key = key.replace(/^\s*/, '').replace(/\s*$/, '')
  return key === '' ? null : key
}

export default class Client {
  constructor(config) {
    this.config = Object.assign({}, defaults, config)
  }

  recognizeUrl(url, options = {}) {
    return this.connection(true, options)
      .sendJson('/remote/recognitions', { url })
      .then(this.handleResponse)
  }

  recognizeImage(data, options = {}) {
    return this.connection(true, options)
      .sendBinary('/recognitions', data)
      .then(this.handleResponse)
  }

  // TODO: remove eslint-disable-line
  fetch(id, options = {}) { // eslint-disable-line no-unused-vars

  }

  handleResponse(response) { return new Recognition(response.data) }

  connection(useAPIKey, options) {
    return new Connection(this.connectionConfig(useAPIKey, options))
  }

  connectionConfig(options, apiKey = undefined) {
    const config = Object.assign({}, this.config, options)
    const params = {}
    if ((config.timeout || 0) > 0) { params.timeout = config.timeout }
    return {
      url: config.url + config.version,
      apiKey: sanitizeAPIKey(config.apiKey),
      params,
    }
  }
}
