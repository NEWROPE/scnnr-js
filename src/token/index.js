import OneTimeToken from './OneTimeToken'

export {
  OneTimeToken,
}

export function buildToken(data) {
  switch (data.type) {
  case 'one-time': return new OneTimeToken(data.value, calculateExpiration(data.expires_in))
  default: return null
  }
}

function calculateExpiration(seconds) { return new Date(Date.now() + seconds * 1000) }
