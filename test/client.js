"use strict";
const chai = require('chai');
const nock = require('nock')

const scnnr = require('../lib/scnnr');
const queuedRecognition = require('./fixtures/queued_recognition');

const should = chai.should();

describe('Client', () => { 
    const config = {
        url: 'https://dummy.scnnr.cubki.jp/',
        version: 'v1',
        key: 'dummy_key',
    };

    let testClient;
    
    beforeEach((done) => {
        testClient = new scnnr.Client(config);
        done();
    });

    describe('recognizeUrl', () => {
        let dummyServer;
        const url = 'https://example.com/dummy.jpg';
        // dummyServer = nock('https://dummy.scnnr.cubki.jp').post('/v1/', { url }).reply(200, queuedRecognition);

        it('should send url in post body');
        it('should resolve with queued recognition')
    });

});