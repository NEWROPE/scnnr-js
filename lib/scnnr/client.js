"use strict";
const defaults = require('./client/defaults');
const axios = require('axios');
const Recognition = require('./recognition');

class Client {
    constructor(config) {
        this.config = Object.assign({}, defaults, config);

        this.axiosInstance = axios.create();
        this.axiosInstance.defaults.baseURL = this.config.url + this.config.version;
        this.axiosInstance.defaults.headers.common['x-api-key'] = this.config.key;
    }

    recognizeUrl(url, options = {}) {
        return new Promise( (resolve, reject) => { 
            this.axiosInstance.post('/remote/recognitions', { url } , { headers: { 'Content-Type': 'application/json' } })
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

    fetch(id, options = {}) {

    }
}

module.exports = Client;