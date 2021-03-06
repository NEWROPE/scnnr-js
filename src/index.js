import Client from './Client'
import Connection from './Connection'
import Recognition from './Recognition'
import authInterceptor, { PrivateKeyAuthInterceptor, PublicKeyAuthInterceptor } from './authInterceptor'
import * as token from './token'
import OneTimeTokenProvider from './OneTimeTokenProvider'
import * as errors from './errors'

function client(options) { return new Client(options) }

export default Object.assign(client, {
  Client,
  Connection,
  Recognition,
  PrivateKeyAuthInterceptor,
  PublicKeyAuthInterceptor,
  authInterceptor,
  OneTimeTokenProvider,
}, token, errors)
