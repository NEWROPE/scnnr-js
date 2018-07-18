export default class OneTimeToken {
  constructor(value, expiresIn) {
    this.value = value
    this.expiresIn = expiresIn
    this.expiresAt = new Date(Date.now() + expiresIn * 1000)
  }

  hasExpired(margin = 0) { return Date.now() >= (this.expiresAt.getTime() - margin) }
}
