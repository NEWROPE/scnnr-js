import axios from 'axios'

import { getErrorByStatusCode } from './errors'

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

    this.httpClient.interceptors.response.use(response => response, this.errorInterceptor)
  }

  get(path) { return this.httpClient.get(path, null) }

  sendJson(path, data) { return this.send(path, data, 'application/json') }

  sendBinary(path, data) { return this.send(path, data, 'application/octet-stream') }

  send(path, data, contentType) {
    return this.httpClient.post(path, data, { headers: { 'Content-Type': contentType } })
  }

  errorInterceptor(err) {
    const statusCode = err.response ? err.response.status : 500
    const errorType = getErrorByStatusCode(statusCode)

    return Promise.reject(new errorType({
      title: err.response.data.title,
      // In case the error is unkown and does not contain
      // details, use the original error message
      message: err.response.data.detail || err.message,
      rawResponse: err.response.data,
      statusCode,
    }))
  }
}
