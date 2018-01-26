import nock from 'nock'
import fs from 'fs'
import path from 'path'
import { expect } from 'chai'

import scnnr from '../dist/scnnr.esm'
import queuedRecognition from './fixtures/queued_recognition.json'
import finishedRecognition from './fixtures/finished_recognition.json'

describe('Client', () => {
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/',
    apiKey: 'dummy-key',
  }
  const client = scnnr(config)

  const behavesLikeRequestToGetRecognition = (method, requestPath, needsAPIKey, sendRequest) => {
    it('should resolve with queued recognition', () => {
      nock(config.url)[method](`/${client.config.version}${requestPath}`).reply(200, queuedRecognition)

      return sendRequest()
        .then(recognition => {
          expect(recognition).to.deep.equal(new scnnr.Recognition(queuedRecognition))
        })
    })

    if (needsAPIKey) {
      it('needs apiKey', () => {
        expect(() => sendRequest({ apiKey: null })).to.throw('`apiKey` configuration is required.')
      })
    } else {
      it('does not need apiKey', () => {
        nock(config.url)[method](`/${client.config.version}${requestPath}`).reply(200)
        expect(() => sendRequest({ apiKey: null })).not.to.throw()
      })
    }
  }

  const pollsWhenTimeoutIsGreaterThanZero = (method, requestPath, needsAPIKey, sendRequest) => {
    it('should do polling successfully if timeout is greater than 0', () => {
      // First request
      nock(config.url)[method](`/${client.config.version}${requestPath}`)
        .query({ timeout: 150 })
        .reply(200, queuedRecognition)

      const pollMocks = nock(config.url)
        // Polling requests
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .times(3)
        .reply(200, queuedRecognition)
        // Final requests successfull response
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .reply(200, finishedRecognition)

      return sendRequest({ timeout: 150 })
        .then(result => {
          expect(pollMocks.isDone()).to.be.true
          expect(result.state).to.equal('finished')
        })
    })

    it('should timeout if time has ran out', () => {
      // First request
      nock(config.url)[method](`/${client.config.version}${requestPath}`)
        .query({ timeout: 1 })
        .reply(200, queuedRecognition)

      const pollMocks = nock(config.url)
        // Polling requests
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .times(100)
        .delay(200)
        .reply(200, queuedRecognition)

      return sendRequest({ timeout: 1 })
        .catch(err => {
          expect(err.name).to.equal('PollTimeout')
        })
    })
  }

  describe('recognizeURL', () => {
    const requestPath = '/remote/recognitions'
    const url = 'https://example.com/dummy.jpg'

    const sendRequest = (options = {}) => client.recognizeURL(url, options)

    it('should send url in post body', () => {
      nock(config.url).post(`/${client.config.version}${requestPath}`, { url }).reply(200)

      return sendRequest()
    })

    behavesLikeRequestToGetRecognition('post', requestPath, true, sendRequest)
    pollsWhenTimeoutIsGreaterThanZero('post', requestPath, true, sendRequest)
  })

  describe('recognizeImage', () => {
    const requestPath = '/recognitions'
    const data = fs.readFileSync(path.join(__dirname, './fixtures/images/sample.png'))
    const sendRequest = (options = {}) => client.recognizeImage(data, options)

    it('should send binary data in post body', () => {
      nock(config.url).post(`/${client.config.version}${requestPath}`).reply(200, (url, body) => {
        expect(body).to.equal(data.toString('hex'))
      })

      return sendRequest()
    })

    it('can send public parameter', () => {
      nock(config.url)
        .post(`/${client.config.version}${requestPath}`)
        .query({ public: 'true' })
        .reply(200, queuedRecognition)

      return sendRequest({ public: true })
    })

    behavesLikeRequestToGetRecognition('post', requestPath, true, sendRequest)
    pollsWhenTimeoutIsGreaterThanZero('post', requestPath, true, sendRequest)
  })

  describe('fetch', () => {
    const recognitionId = 'some/recognition-id'
    const requestPath = `/recognitions/${recognitionId}`
    const sendRequest = (options = {}) => client.fetch(recognitionId, options)

    it('should get a result from API', () => {
      nock(config.url).get(`/${client.config.version}${requestPath}`).reply(200)

      return client.fetch(recognitionId)
    })

    behavesLikeRequestToGetRecognition('get', requestPath, false, sendRequest)
  })
})
