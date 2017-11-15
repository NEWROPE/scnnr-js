export declare namespace Scnnr {
  interface Options {}
  interface Client {
    recognizeUrl(url: string, options?: Options): Promise<Recognition>
    recognizeImage(url: ArrayBuffer, options?: Options): Promise<Recognition>
    fetch(id: string, options?: Options): Promise<Recognition>
  }
  interface Error {}
  interface Recognition {
    id: string
    objects: Array<{}>
    state: string
    error?: Error
  }
}
declare function scnnr(options?: Scnnr.Options): Scnnr.Client
export default scnnr
