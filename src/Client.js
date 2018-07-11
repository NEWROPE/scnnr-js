import defaults from './Client/defaults'
import Connection from './Connection'
import Recognition from './Recognition'
import { RecognitionError } from './errors'
import poll from './polling'

function getTimeoutLength(timeout = 0, timeoutMaxAllowed) {
  return (timeout - timeoutMaxAllowed) < 0 ? timeout : timeoutMaxAllowed
}

export default class Client {
  constructor(config) {
    this.config = Object.assign({}, defaults, config)
  }

  recognizeURL(url, options = {}) {
    return this.recognizeRequest(
      (options) => this.connection(true, options).sendJson('/remote/recognitions', { url }),
      options
    )
  }

  recognizeImage(data, options = {}) {
    const params = { public: options.public }
    const fullOptions = Object.assign({}, options, { params })

    return this.recognizeRequest(
      (options) => this.connection(true, options).sendBinary('/recognitions', data),
      fullOptions
    )
  }

  // Takes a request and timeout and checks if the recognize request
  // should start the polling process and calls poll if positive
  recognizeRequest(requestFunc, options) {
    const timeoutForFirstRequest = getTimeoutLength(options.timeout, 25)
    const opt = Object.assign({}, options, { timeout: timeoutForFirstRequest })
    const request = requestFunc(opt)

    return new Promise((resolve, reject) => {
      request
        .then(this.handleResponse)
        .then(recognition => {
          if ((options.timeout || 0) > 0 && !recognition.isFinished()) {
            return poll({
              requestFunc: (options) => this.fetch(recognition.id, options),
              conditionChecker: (recognition) => recognition.isFinished(),
              remainingTime: options.timeout - timeoutForFirstRequest,
            })
          }

          return resolve(recognition)
        })
        .then(resolve)
        .catch(reject)
    })
  }

  fetch(id, options = {}) {
    return this.connection(false, options)
      .get(`/recognitions/${id}`)
      .then(this.handleResponse)
  }

  handleResponse(response) {
    const recognition = new Recognition(response.data)

    if (recognition.hasError()) {
      throw new RecognitionError(recognition.error, recognition)
    }

    return recognition
  }

  connection(needSign, options) {
    return Connection.build(needSign, Object.assign({}, this.config, options))
  }
}
