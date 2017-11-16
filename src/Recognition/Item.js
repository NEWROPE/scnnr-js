export default class Item {
  constructor(props) {
    this.category = props.category
    this.boundingBox = props.boundingBox || props.bounding_box
    this.labels = props.labels
  }
}
