import axios from 'axios'

export default class Connection {
  constructor({ url, apiKey, params }) {
    this.httpClient = axios.create()
    this.httpClient.defaults.baseURL = url

    if (apiKey) { this.httpClient.defaults.headers['x-api-key'] = apiKey }

    this.httpClient.defaults.params = params
  }

  get(path) {
    return this.httpClient.get(path, null, { headers: { 'Content-Type': 'application/json' } })
  }

  sendJson(path, data) { return this.send(path, data, 'application/json') }

  sendBinary(path, data) { return this.send(path, data, 'application/octet-stream') }

  send(path, data, contentType) {
    return this.httpClient.post(path, data, { headers: { 'Content-Type': contentType } })
  }
}
