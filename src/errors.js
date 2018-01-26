export class PreconditionFailed extends Error {
  constructor(message) {
    super(message)
    this.name = 'PreconditionFailed'
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, PreconditionFailed)
    } else {
      this.stack = (new Error()).stack
    }
  }
}

export class PollTimeout extends Error {
  constructor(message) {
    super(message)
    this.name = 'PollTimeout'
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, PollTimeout)
    } else {
      this.stack = (new Error()).stack
    }
  }
}
