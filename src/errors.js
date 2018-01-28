export class ScnnrError extends Error {
  constructor(message) {
    super(message)
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, ScnnrError)
    } else {
      this.stack = (new Error()).stack
    }
  }
}

export class PollTimeout extends ScnnrError {
  constructor(message) {
    super(message)
    this.name = 'PollTimeout'
  }
}

export class PreconditionFailed extends ScnnrError {
  constructor(message) {
    super(message)
    this.name = 'PreconditionFailed'
  }
}

function buildMessage(title, detail, type) {
  let message = ''

  if (title) message = `[${title}]`
  if (detail) message = `${message} ${detail}`
  if (type) message = `${message} (${type})`

  return message
}

export class ScnnrAPIError extends ScnnrError {
  constructor({ title, detail, type, statusCode, rawResponse }) {
    const message = buildMessage(title, detail, type)
    super(message)
    this.name = 'ScnnrAPIError'
    Object.assign(this, { title, detail, type, statusCode, rawResponse })
  }
}
