"use strict";
const defaults = require('./client/defaults');
const axios = require('axios');
const Recognition = require('./recognition');

class Client {
    constructor(config) {
        this.config = Object.assign({}, defaults, config);
        this.lastId = null;

        axios.defaults.baseURL = this.config.url + this.config.version;
        axios.defaults.headers.post['x-api-key'] = this.config.key;
    }

    recognizeUrl(url, options = {}) {
        return new Promise( (resolve, reject) => { 
            axios.post('/remote/recognitions', { url } , { headers: { 'Content-Type': 'application/json' } })
            .then( response => {
                let result = response.data;
                resolve(new Recognition(result));
            })
            .catch ( error => { 
                reject(error.response.data); // errors
            });
        });
    }

    recognizeImg(imageFile, options = {}) {
        
    }

    fetch(id = this.lastId, options = {}) {

    }
}

module.exports = Client;