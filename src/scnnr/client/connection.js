import axios from 'axios'

export default class Connection {
  constructor({ url, version, key, timeout }) {
    this.httpClient = axios.create()

    this.httpClient.defaults.baseURL = url + version
    this.httpClient.defaults.headers.post['x-api-key'] = key

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
