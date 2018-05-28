import Item from './Recognition/Item'
import Image from './Recognition/Image'

export default class Recognition {
  constructor({ id, objects, state, image, error }) {
    this.id = id
    this.objects = (objects || []).map((obj) => new Item(obj))
    this.state = state
    if (image != null) { this.image = new Image(image) }
    this.error = error
  }

  isFinished() {
    return this.state === 'finished'
  }

  hasError() {
    return !!this.error
  }
}

Recognition.Item = Item
Recognition.Image = Image
