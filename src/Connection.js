import axios from 'axios'

export default class Connection {
  constructor({ url, apiKey, params, onUploadProgress, onDownloadProgress }) {
    const headers = {}
    if (apiKey) { headers['x-api-key'] = apiKey }

    this.httpClient = axios.create({
      params, headers,
      baseURL: url,
      onUploadProgress: onUploadProgress,
      onDownloadProgress: onDownloadProgress,
    })
  }

  get(path) { return this.httpClient.get(path, null) }

  sendJson(path, data) { return this.send(path, data, 'application/json') }

  sendBinary(path, data) { return this.send(path, data, 'application/octet-stream') }

  send(path, data, contentType) {
    return this.httpClient.post(path, data, { headers: { 'Content-Type': contentType } })
  }
}
