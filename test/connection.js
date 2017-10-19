"use strict";
const chai = require('chai');
const nock = require('nock')

const Connection = require('../lib/scnnr/client/connection');
const queuedRecognition = require('./fixtures/queued_recognition');

const should = chai.should();

describe('Connection', () => { 
    const config = {
        url: 'https://dummy.scnnr.cubki.jp/',
        version: 'v1',
        key: 'dummy_key',
    };

    const dummyServer = nock('https://dummy.scnnr.cubki.jp').post('/v1/').reply(200, queuedRecognition);
    const testConnection = new Connection(config);

    it('resolves with json body', () => {
        return testConnection.sendJson('/', { data: 'dummy_data' } )
        .then( result => {
            result.should.eql(queuedRecognition);
        });
    });

});