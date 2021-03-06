import axios from 'axios'

import { ScnnrAPIError } from './errors'
import authInterceptor from './authInterceptor'

export default class Connection {
  constructor({ url, apiKey, params, authInterceptor, onUploadProgress, onDownloadProgress }) {
    const headers = {}
    if (apiKey) { headers['x-api-key'] = apiKey }

    this.httpClient = axios.create({
      params, headers,
      baseURL: url,
      onUploadProgress: onUploadProgress,
      onDownloadProgress: onDownloadProgress,
    })

    this.httpClient.interceptors.response.use(response => response, this.errorInterceptor)

    if (authInterceptor != null) { this.httpClient.interceptors.request.use(authInterceptor.interceptRequest) }
  }

  get(path) { return this.httpClient.get(path, null) }

  sendJson(path, data) { return this.send(path, data, 'application/json') }

  sendBinary(path, data) { return this.send(path, data, 'application/octet-stream') }

  send(path, data, contentType) {
    return this.httpClient.post(path, data, { headers: { 'Content-Type': contentType } })
  }

  errorInterceptor(err) {
    // If err does not have response, is not an HTTP error. Reject normally
    if (!err.response) {
      return Promise.reject(err)
    }

    return Promise.reject(new ScnnrAPIError({
      title: err.response.data.title || err.response.data.message,
      // In case the error is unkown and does not contain
      // details, use the original error message
      detail: err.response.data.detail || err.message,
      type: err.response.data.type,
      rawResponse: err.response.data,
      statusCode: err.response.status,
    }))
  }

  static build(needAuth, config) {
    const params = config.params || {}
    if ((config.timeout || 0) > 0) { params.timeout = config.timeout }
    return new Connection({
      params,
      authInterceptor: needAuth ? authInterceptor(config) : null,
      url: config.url + config.version,
      onUploadProgress: config.onUploadProgress,
      onDownloadProgress: config.onDownloadProgress,
    })
  }
}
