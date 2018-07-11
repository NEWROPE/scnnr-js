import PrivateKeySigner from './PrivateKeySigner'
import PublicKeySigner from './PublicKeySigner'
import { PreconditionFailed } from '../errors'

export {
  PrivateKeySigner,
  PublicKeySigner,
}

function sanitizeAPIKey(key) {
  if (typeof key !== 'string') {
    return null
  }
  key = key.replace(/^\s*/, '').replace(/\s*$/, '')
  return key === '' ? null : key
}

export default function signer(config) {
  const apiKey = sanitizeAPIKey(config.apiKey)
  const publicAPIKey = sanitizeAPIKey(config.publicAPIKey)
  if (apiKey != null) {
    return new PrivateKeySigner(apiKey)
  } else if (publicAPIKey != null) {
    return new PublicKeySigner(publicAPIKey, { url: config.url, version: config.version })
  } else {
    throw new PreconditionFailed('`apiKey` or `publicAPIKey` configuration is required.')
  }
}
