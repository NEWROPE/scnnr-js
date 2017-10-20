'use strict'

class Recognition {
  constructor({ id, objects = {}, state, error = {} }) {
    this.id = id
    this.objects = objects
    this.state = state
    this.error = error
  }
}

module.exports = Recognition
