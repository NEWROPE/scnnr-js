import PrivateKeySigner from './PrivateKeySigner'

export {
  PrivateKeySigner
}

export default function signer(apiKey) {
  return new PrivateKeySigner(apiKey)
}
