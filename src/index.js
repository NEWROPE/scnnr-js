import Client from './client'
import Connection from './Connection'
import Recognition from './recognition'

function client(config) { return new Client(config) }

export default {
  client,
  Client,
  Connection,
  Recognition
}
