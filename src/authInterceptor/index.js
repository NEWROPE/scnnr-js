import PrivateKeyAuthInterceptor from './PrivateKeyAuthInterceptor'
import PublicKeyAuthInterceptor from './PublicKeyAuthInterceptor'
import { PreconditionFailed } from '../errors'

export {
  PrivateKeyAuthInterceptor,
  PublicKeyAuthInterceptor,
}

function sanitizeAPIKey(key) {
  if (typeof key !== 'string') {
    return null
  }
  key = key.replace(/^\s*/, '').replace(/\s*$/, '')
  return key === '' ? null : key
}

export default function authInterceptor(config) {
  const apiKey = sanitizeAPIKey(config.apiKey)
  const publicAPIKey = sanitizeAPIKey(config.publicAPIKey)
  if (apiKey != null) {
    return new PrivateKeyAuthInterceptor(apiKey)
  } else if (publicAPIKey != null) {
    return new PublicKeyAuthInterceptor(publicAPIKey, { url: config.url, version: config.version })
  } else {
    throw new PreconditionFailed('`apiKey` or `publicAPIKey` configuration is required.')
  }
}
