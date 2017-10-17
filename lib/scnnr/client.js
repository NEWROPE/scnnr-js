"use strict";
const defaults = require('./client/defaults')
const axios = require('axios');

class Client {
    constructor(config) {
        this.config = Object.assign({}, defaults, config);
        this.lastId = null;

        axios.defaults.baseURL = this.config.url + this.config.version;
        axios.defaults.headers.post['x-api-key'] = this.config.key;
    }

    recognizeUrl(url, options = {}) {
        axios.post('/remote/recognitions', { url } , { headers: { 'Content-Type': 'application/json' } })
        .then( response => {
            let result = JSON.stringify(response.data, null, 2);
            console.log(result);
        })
        .catch ( error => { 
            console.log(error);
        });
    }

    recognizeImg(imageFile, options = {}) {
        
    }

    fetch(id = this.lastId, options = {}) {

    }
}

module.exports = Client;