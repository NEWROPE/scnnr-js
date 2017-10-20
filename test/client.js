'use strict'

const chai = require('chai')
const nock = require('nock')

const scnnr = require('../lib/scnnr')
const queuedRecognition = require('./fixtures/queued_recognition')

const should = chai.should()

describe('Client', () => { 
  const config = {
    url: 'https://dummy.scnnr.cubki.jp/',
    version: '',
    key: '',
  }
  const testClient = new scnnr.Client(config)

  describe('recognizeUrl', () => {
    const path = '/remote/recognitions'

    it('should send url in post body', () => {
      const url = 'https://example.com/dummy.jpg'
      nock(config.url).post(path, { url }).reply(200)

      return testClient.recognizeUrl(url)
    })

    it('should resolve with queued recognition', () => {
      nock(config.url).post(path).reply(200, queuedRecognition)

      return testClient.recognizeUrl('')
        .then(result => {
          result.should.be.eql(queuedRecognition)
        })
    })
  })

})
