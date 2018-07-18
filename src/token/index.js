import OneTimeToken from './OneTimeToken'

export {
  OneTimeToken,
}

export function buildToken(data) {
  switch (data.type) {
  case 'one-time': return new OneTimeToken(data.value, data.expires_in)
  default: return null
  }
}
