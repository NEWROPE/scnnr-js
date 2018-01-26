import defaults from './Client/defaults'
import Connection from './Connection'
import Recognition from './Recognition'
import { PreconditionFailed, PollTimeout } from './errors'


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
    const request = this.connection(true, options)
      .sendJson('/remote/recognitions', { url })
      .then(this.handleResponse)

    return this.pollingRecognize(request, options.timeout)
  }

  recognizeImage(data, options = {}) {
    const params = { public: options.public }
    const fullOptions = Object.assign({}, options, { params })

    const request = this.connection(true, fullOptions)
      .sendBinary('/recognitions', data)
      .then(this.handleResponse)

    return this.pollingRecognize(request, fullOptions.timeout)
  }

  // Takes a request and timeout and checks if the recognize request
  // should start the polling process and calls poll if positive
  pollingRecognize(request, timeout) {
    return new Promise((resolve, reject) => {
      request
        .then(recognition => {
          if (timeout > 0 && !recognition.isFinished()) {
            return this.poll(recognition.id, timeout, resolve, reject)
          }

          return resolve(recognition)
        })
        .catch(reject)
    })
  }

  fetch(id, options = {}) {
    return this.connection(false, options)
      .get(`/recognitions/${id}`)
      .then(this.handleResponse)
  }

  // poll calls itself until recognition is finished or time expires
  poll(id, remainingTime, resolve, reject, startPollTimeout = 100) {
    const startTime = new Date().getTime()

    this.fetch(id)
      .then(recognition => {
        if (!recognition.isFinished()) {
          const elapsedTime = (new Date().getTime() - startTime) / 1000 // Divide to convert to seconds
          const newRemainingTime = remainingTime - elapsedTime

          if (newRemainingTime <= 0) {
            return reject(new PollTimeout(`Polling for ${id} timed out`))
          }

          // See if next polling is going to be over remaining timeout time
          // if it is just use the remaining time for the next call to poll
          const isNextPollingOverTimeout = (newRemainingTime - (startPollTimeout / 1000)) <= 0
          const pollTimeout =  isNextPollingOverTimeout ? newRemainingTime * 1000 : startPollTimeout

          return setTimeout(() =>
            this.poll.call(
              this, id, newRemainingTime, resolve, reject, startPollTimeout * 1.5
            ), pollTimeout)
        }

        return resolve(recognition)
      })
      .catch(reject)
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
