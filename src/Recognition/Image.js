import Size from './Image/Size'

export default class Image {
  constructor({ url, size }) {
    this.url = url
    this.size = new Size(size)
  }
}

Image.Size = Size
