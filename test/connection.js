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

    it('resolves with json body', () => {
        const testData = { data: 'dummy_data' };
        const dummyServer = nock(config.url).post('/v1/', testData).reply(200, testData);
        
        return testConnection.sendJson('/', testData)
        .then( result => {
            result.should.eql(testData);
        });
    });

});