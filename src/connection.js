import axios from 'axios'

function isPresent(str) {
  return typeof str === 'string' && str.replace(/^\s*/, '').replace(/\s*$/, '') !== ''
}

export default class Connection {
  constructor({ url, version, apiKey, timeout }) {
    this.httpClient = axios.create()
    this.httpClient.defaults.baseURL = url + version

    this.hasKey = isPresent(apiKey)
    if (this.hasKey) {
      this.httpClient.defaults.headers.post['x-api-key'] = apiKey
    }

    if (timeout > 0) {
      this.httpClient.defaults.params = {} // create default params
      this.httpClient.defaults.params['timeout'] = timeout
    }
  }

  sendJson(path, data) { return this.send(path, data, 'application/json') }

  sendBinary(path, data) { return this.send(path, data, 'application/octet-stream') }

  send(path, data, contentType) {
    return this.httpClient.post(path, data, { headers: { 'Content-Type': contentType } })
  }
}
