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

export default function signer(apiKey, publicAPIKey) {
  apiKey = sanitizeAPIKey(apiKey)
  publicAPIKey = sanitizeAPIKey(publicAPIKey)
  if (apiKey != null) {
    return new PrivateKeySigner(apiKey)
  } else if (publicAPIKey != null) {
    return new PublicKeySigner(apiKey)
  } else {
    throw new PreconditionFailed('`apiKey` or `publicAPIKey` configuration is required.')
  }
}
