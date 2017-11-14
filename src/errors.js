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
