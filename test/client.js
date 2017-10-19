"use strict";
const scnnr = require('../lib/scnnr');
const chai = require('chai');
const should = chai.should();

/*
describe('Client', () => {
    const config = {
        url: 'https://dummy.scnnr.cubki.jp/',
        version: 'v1',
        timeout: 0,
        key: 'dummy_key',
    };

    let testClient;

    beforeEach((done) => {
        testClient = new scnnr.Client(config);
        done();
    });
    
    describe('recognizeUrl', () => {
        const url = 'https://example.com/dummy.jpg';

        it('should be queued', (done) => {
            testClient.recognizeUrl(url)
            .then(result => {
                /// do testing
                done();
            })
        });

    });
});
*/