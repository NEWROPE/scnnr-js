import Client from './Client'
import Connection from './Connection'
import Recognition from './Recognition'
import signer, { PrivateKeySigner } from './signer'
import * as errors from './errors'

function client(options) { return new Client(options) }

export default Object.assign(client, {
  Client,
  Connection,
  Recognition,
  PrivateKeySigner,
  signer,
}, errors)
