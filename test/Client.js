import nock from 'nock'
import fs from 'fs'
import path from 'path'
import { expect } from 'chai'

import scnnr from '../dist/scnnr.esm'
import queuedRecognition from './fixtures/queued_recognition.json'
import finishedRecognition from './fixtures/finished_recognition.json'
import errorRecognition from './fixtures/error_recognition.json'

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
        expect(() => sendRequest({ apiKey: null })).to.throw('`apiKey` or `publicAPIKey` configuration is required.')
      })
    } else {
      it('does not need apiKey', () => {
        nock(config.url)[method](`/${client.config.version}${requestPath}`).reply(200)
        expect(() => sendRequest({ apiKey: null })).not.to.throw()
      })
    }

    it('should reject promise if recognition has error', () => {
      nock(config.url)[method](`/${client.config.version}${requestPath}`).reply(200, errorRecognition)

      return sendRequest()
        .then(result => expect(result).to.be.undefined)
        .catch(err => {
          expect(err.detail).to.equal('some error occurred')
          expect(err.title).to.equal('Recognition Error')
          expect(err.type).to.equal('recognition-error')
          expect(err.recognition.id).to.equal('20170829/ed4c674c-7970-4e9c-9b26-1b6076b36b49')
        })
    })
  }

  const pollsWhenTimeoutIsGreaterThanZero = (method, requestPath, needsAPIKey, sendRequest) => {
    it('should do polling successfully if timeout is greater than 0', () => {
      // First request
      const recognitionMock = nock(config.url)[method](`/${client.config.version}${requestPath}`)
        .query({ timeout: 25 })
        .reply(200, queuedRecognition)

      const pollMocks = nock(config.url)
        // Polling requests
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .query({ timeout: 25 })
        .times(2)
        .reply(200, queuedRecognition)
        // Final request successfull response
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .query({ timeout: 25 })
        .reply(200, finishedRecognition)

      return sendRequest({ timeout: 100 })
        .then(result => {
          expect(recognitionMock.isDone()).to.be.true
          expect(pollMocks.isDone()).to.be.true
          expect(result.state).to.equal('finished')
        })
    })

    it('should poll with odd timeout times', () => {
      // First request
      const recognitionMock = nock(config.url)[method](`/${client.config.version}${requestPath}`)
        .query({ timeout: 25 })
        .reply(200, queuedRecognition)

      const pollMocks = nock(config.url)
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .query({ timeout: 25 })
        .reply(200, queuedRecognition)
        // Final request successfull response
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .query({ timeout: 15 })
        .reply(200, finishedRecognition)

      return sendRequest({ timeout: 65 })
        .then(result => {
          expect(recognitionMock.isDone()).to.be.true
          expect(pollMocks.isDone()).to.be.true
          expect(result.state).to.equal('finished')
        })
    })

    it('should timeout if time has ran out', () => {
      // First request
      nock(config.url)[method](`/${client.config.version}${requestPath}`)
        .query({ timeout: 2 })
        .reply(200, queuedRecognition)

      const pollMocks = nock(config.url)
        // Polling requests
        .get(`/${client.config.version}/recognitions/${queuedRecognition.id}`)
        .query({ timeout: 2 })
        .times(100)
        .reply(200, queuedRecognition)

      return sendRequest({ timeout: 2 })
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
