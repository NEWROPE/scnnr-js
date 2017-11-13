import nock from 'nock'

import Scnnr from '../dist/scnnr.esm'
import queuedRecognition from './fixtures/queued_recognition.json'

describe('Client', () => {
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: '',
    key: '',
  }
  const client = new Scnnr.Client(config)

  describe('recognizeUrl', () => {
    const path = '/remote/recognitions'

    it('should send url in post body', () => {
      const url = 'https://example.com/dummy.jpg'
      nock(config.url).post(path, { url }).reply(200)

      return client.recognizeUrl(url)
    })

    it('should resolve with queued recognition', () => {
      nock(config.url).post(path).reply(200, queuedRecognition)

      return client.recognizeUrl('')
        .then(result => {
          result.should.be.eql(queuedRecognition)
        })
    })
  })

})
