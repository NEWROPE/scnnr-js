"use strict";
const defaults = require('./client/defaults');
const Connection = require('./client/connection');
const Recognition = require('./recognition');

class Client {
    constructor(config) {
        this.config = Object.assign({}, defaults, config);

        this.connection = new Connection(this.config);
    }

    recognizeUrl(url, options = {}) {
        return this.connection.sendJson('/remote/recognitions', { url });
    }

    recognizeImg(imageFile, options = {}) {
        
    }

    fetch(id, options = {}) {

    }
}

module.exports = Client;