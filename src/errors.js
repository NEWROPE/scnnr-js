export class ScnnrError extends Error {
  constructor(message) {
    super(message)
    this[Symbol.toStringTag] = 'scnnr-error'
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, ScnnrError)
    } else {
      this.stack = (new Error()).stack
    }
  }
}

export class PreconditionFailed extends ScnnrError {
  constructor(message) {
    super(message)
    this.name = 'PreconditionFailed'
  }
}

export class ScnnrAPIError extends ScnnrError {
  constructor({ title, message, statusCode, rawResponse }) {
    super(message)
    this[Symbol.toStringTag] = 'scnnr-api-error'
    this.name = (title || 'ScnnrAPIError').replace(/ /g, '')
    this.statusCode = statusCode
    this.rawResponse = rawResponse
  }
}

export class ForbiddenError extends ScnnrAPIError {
  constructor({ rawResponse }) {
    const message = 'You don\'t have access to this resource'
    super({ title: 'Forbidden', message, rawResponse, statusCode: 403 })
  }
}

export class TooManyRequestsError extends ScnnrAPIError {
  constructor({ rawResponse }) {
    const message = 'Exceeded request quota'
    super({ title: 'TooManyRequests', message, rawResponse, statusCode: 429 })
  }
}

const httpErrorsByCode = {
  '403': ForbiddenError,
  '429': TooManyRequestsError,
}

export function getErrorByStatusCode(statusCode) {
  return httpErrorsByCode[statusCode] || ScnnrAPIError
}

