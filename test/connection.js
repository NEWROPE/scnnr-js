"use strict";
const chai = require('chai');
const nock = require('nock')

const Connection = require('../lib/scnnr/client/connection');

const should = chai.should();

describe('Connection', () => { 
    const config = {
        url: 'https://dummy.scnnr.cubki.jp/',
        version: 'v1',
        key: 'dummy_key',
    };
    const testConnection = new Connection(config);

    describe('sendJson', () => {
        const testData = { data: 'dummy_data' };

        it('sends x-api-key', () => {
            const dummyServer = nock(config.url, { reqheaders: { 'x-api-key': config.key } }).post('/v1/').reply(200);

            return testConnection.sendJson('/', '');
        });

        it('sends application/json header', () => {
            const dummyServer = nock(config.url, { reqheaders: { 'Content-Type': 'application/json' } }).post('/v1/').reply(200);
            
            return testConnection.sendJson('/', '');
        });

        it('sends json body', () => {
            const dummyServer = nock(config.url).post('/v1/', testData).reply(200);
            
            return testConnection.sendJson('/', testData);
        });

        it('resolves with json body', () => {
            const dummyServer = nock(config.url).post('/v1/').reply(200, testData);
            
            return testConnection.sendJson('/', '')
            .then( result => {
                result.should.eql(testData);
            });
        });
    });

});