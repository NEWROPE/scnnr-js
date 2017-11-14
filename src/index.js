import Client from './Client'
import Connection from './Connection'
import Recognition from './Recognition'

function client(options) { return new Client(options) }

export default Object.assign(client, {
  Client,
  Connection,
  Recognition,
})
