export declare namespace Scnnr {
  interface Options {}
  interface Client {
    recognizeUrl(url: string, options?: Options): Promise<Recognition>
    recognizeImage(url: ArrayBuffer, options?: Options): Promise<Recognition>
    fetch(id: string, options?: Options): Promise<Recognition>
  }
  interface Error {}
  interface Label {
    name: string
    score: number
  }
  interface BoundingBox {
    top: number
    right: number
    bottom: number
    left: number
  }
  interface Item {
    category: string
    labels: Array<Label>
    boundingBox: BoundingBox
  }
  interface Recognition {
    id: string
    objects: Array<Item>
    state: string
    error?: Error
  }
}
declare var scnnr: {
  (options?: Scnnr.Options): Scnnr.Client
  Recognition: new (props: Scnnr.Recognition) => Scnnr.Recognition
}
export default scnnr
