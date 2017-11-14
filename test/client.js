import nock from 'nock'
import fs from 'fs'
import path from 'path'
import { expect } from 'chai'

import scnnr from '../dist/scnnr.esm'
import queuedRecognition from './fixtures/queued_recognition.json'

describe('Client', () => {
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/',
    apiKey: 'dummy-key',
  }
  const client = scnnr(config)

  describe('recognizeUrl', () => {
    const requestPath = '/remote/recognitions'
    const url = 'https://example.com/dummy.jpg'

    it('should send url in post body', () => {
      nock(config.url).post(`/${client.config.version}${requestPath}`, { url }).reply(200)

      return client.recognizeUrl(url)
    })

    it('should resolve with queued recognition', () => {
      nock(config.url).post(`/${client.config.version}${requestPath}`).reply(200, queuedRecognition)

      return client.recognizeUrl(url)
        .then(recognition => {
          expect(recognition).to.deep.equal(new scnnr.Recognition(queuedRecognition))
        })
    })
  })

  describe('recognizeImage', () => {
    const requestPath = '/recognitions'
    const data = fs.readFileSync(path.join(__dirname, './fixtures/images/sample.png'))

    it('should send binary data in post body', () => {
      nock(config.url).post(`/${client.config.version}${requestPath}`).reply(200, (url, body) => {
        expect(body).to.equal(data.toString('hex'))
      })

      return client.recognizeImage(data)
    })

    it('should resolve with queued recognition', () => {
      nock(config.url).post(`/${client.config.version}${requestPath}`).reply(200, queuedRecognition)

      return client.recognizeImage(data)
        .then(result => {
          expect(result).to.deep.equal(new scnnr.Recognition(queuedRecognition))
        })
    })
  })
})
