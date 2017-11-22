import defaults from './client/defaults'
import Connection from './Connection'
import Recognition from './Recognition'
import { PreconditionFailed } from './errors'

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

  recognizeURL(url, options = {}) {
    return this.connection(true, options)
      .sendJson('/remote/recognitions', { url })
      .then(this.handleResponse)
  }

  recognizeImage(data, options = {}) {
    const params = {}
    if (options.public) { params.public = true }
    return this.connection(true, Object.assign({}, options, { params }))
      .sendBinary('/recognitions', data)
      .then(this.handleResponse)
  }

  fetch(id, options = {}) {
    return this.connection(false, options)
      .get(`/recognitions/${id}`)
      .then(this.handleResponse)
  }

  handleResponse(response) { return new Recognition(response.data) }

  connection(useAPIKey, options) {
    return new Connection(this.connectionConfig(useAPIKey, options))
  }

  connectionConfig(useAPIKey, options) {
    const config = Object.assign({}, this.config, options)
    const apiKey = sanitizeAPIKey(config.apiKey)
    if (useAPIKey && apiKey == null) {
      throw new PreconditionFailed('`apiKey` configuration is required.')
    }
    const params = options.params || {}
    if ((config.timeout || 0) > 0) { params.timeout = config.timeout }
    return {
      apiKey, params,
      url: config.url + config.version,
      onUploadProgress: config.onUploadProgress,
      onDownloadProgress: config.onDownloadProgress,
    }
  }
}
