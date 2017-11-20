export declare namespace Scnnr {
  interface Options {
    url?: string
    version?: string
    timeout?: number
    apiKey?: string
    onDownloadProgress?: (event: ProgressEvent) => void
    onUploadProgress?: (event: ProgressEvent) => void
  }
  interface RecognizeImageOptions extends Options {
    public?: boolean
  }
  type RecognizeUrlOptions = Options
  type FetchOptions = Options
  interface Client {
    recognizeUrl(url: string, options?: RecognizeUrlOptions): Promise<Recognition>
    recognizeImage(data: ArrayBuffer, options?: RecognizeImageOptions): Promise<Recognition>
    fetch(id: string, options?: FetchOptions): Promise<Recognition>
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
  interface Recognition {
    id: string
    objects: Array<Item>
    state: string
    image?: Image
    error?: Error
  }
  interface Item {
    category: string
    labels: Array<Label>
    boundingBox: BoundingBox
  }
  interface Image {
    url: string
    size: ImageSize
  }
  interface ImageSize {
    width: number
    height: number
  }
}
declare var scnnr: {
  (options?: Scnnr.Options): Scnnr.Client
  Recognition: new (props: Scnnr.Recognition) => Scnnr.Recognition
}
export default scnnr
