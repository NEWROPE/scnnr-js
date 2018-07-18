export default class OneTimeToken {
  constructor(value, expiresAt) {
    this.value = value
    this.expiresAt = expiresAt
  }

  hasExpired(margin = 0) { return Date.now() >= (this.expiresAt.getTime() - margin) }
}
