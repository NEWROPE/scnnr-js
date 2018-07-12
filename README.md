# Official #CBK scnnr client library for JavaScript.

- [#CBK scnnr](https://scnnr.cubki.jp/)
- [API Documentation](https://api.scnnr.cubki.jp/v1/docs)

## Installation
### NPM
```
npm install --save scnnr
```

### Yarn
```
yarn add scnnr
```

## Configuration
You can pass configuration options as an object on creating a client instance.

```
import scnnr from 'scnnr'
const client = scnnr({
  apiKey: 'YOUR API KEY',
  version: 'v1',
  timeout: 0, // sec
})
```

Or, you can use a public API key as follows.

```
import scnnr from 'scnnr'
const client = scnnr({
  publicAPIKey: 'YOUR PUBLIC API KEY',
})
```

For more details about public API keys, please see [here](https://api.scnnr.cubki.jp/v1/docs#tag/authorization%2Fpaths%2F~1auth~1tokens%2Fpost).

Operations through the client basically return `Promise` instance and the promises will be resolved with a `Recognition` instance.

## Examples
### Basic usage
Request image recognition by an image URL.

```
const url = 'https://example.com/dummy.jpg'
let promisedRecognition = client.recognizeURL(url)

// Or, you can override timeout option.
promisedRecognition = client.recognizeURL(url, { timeout: 10 })
```

Request image recognition by a binary image.

```
promisedRecognition = client.recognizeImage(image) // image is an ArrayBuffer
```

`Recognition` class represents the image recognition result from API.
If the recognition processing is completed, the promise is resolved with `Recognition` with `finished` state.

```
promisedRecognition
  .filter(recognition => console.log(recognition.state === 'finished')) // => true

promisedRecognition
  .filter(recognition => console.log(JSON.stringify(recognition, null, 2)))
/*
=> {
  "id": "20171207/27c6e071-c8f0-426e-806b-4a8b4390aef7",
  "objects": [
    {
      "category": "bottoms",
      "boundingBox": {
        "bottom": 1,
        "left": 0.3233167,
        "right": 0.7062677,
        "top": 0.46807754
      },
      "labels": [
        {
          "name": "パンツ",
          "score": 0.9952112
        },
        {
          "name": "スキニー",
          "score": 0.9802289
        },
        {
          "name": "ブラック",
          "score": 0.81389445
        },
        {
          "name": "デニム",
          "score": 0.8030528
        },
        {
          "name": "ジーンズ",
          "score": 0.7185342
        }
      ]
    },
    {
      "category": "tops_1",
      "boundingBox": {
        "bottom": 0.5370441,
        "left": 0.2191737,
        "right": 0.7182835,
        "top": 0.06979297
      },
      "labels": [
        {
          "name": "カーキ",
          "score": 0.98178136
        },
        {
          "name": "Tシャツ",
          "score": 0.95349556
        },
        {
          "name": "無地",
          "score": 0.90042996
        },
        {
          "name": "Vネック",
          "score": 0.8733328
        },
        {
          "name": "カットソー",
          "score": 0.7097928
        },
        {
          "name": "プルオーバー",
          "score": 0.51508075
        }
      ]
    }
  ],
  "state": "finished"
}
 */
```

If the timeout value is zero or `null`, the promise is resolved with `Recognition` with `queued` state.

Then you can fetch the recognition result using `client.fetch`.

```
promisedRecognition.then(recognition => console.log(recognition.state === 'queued')) // => true

promisedRecognition.then(recognition => console.log(JSON.stringify(recognition)))
// => {"id":"20171207/27c6e071-c8f0-426e-806b-4a8b4390aef7","state":"queued"}

promisedRecognition.then(recognition => client.fetch(recognition.id))
  .then(recognition => console.log(recognition.state === 'finished')) // => true
```
