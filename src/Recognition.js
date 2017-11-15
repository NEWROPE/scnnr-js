import Item from './Recognition/Item'

export default class Recognition {
  constructor({ id, objects, state, error }) {
    this.id = id
    this.objects = (objects || []).map((obj) => new Item(obj))
    this.state = state
    this.error = error
  }
}

Recognition.Item = Item
