"use strict";
const axios = require('axios');

class Connection {
    constructor({ url, version, key }) {
        this.axiosInstance = axios.create();

        this.axiosInstance.defaults.baseURL = url + version;
        this.axiosInstance.defaults.headers.common['x-api-key'] = key;
    }

    sendJson(path, data) {
        return new Promise( (resolve, reject) => { 
            this.axiosInstance.post(path, data, { headers: { 'Content-Type': 'application/json' } })
            .then( response => {
                resolve(response.data);
            })
            .catch ( error => { 
                reject({} || error.response.error);
            });
        });
    }
}

module.exports = Connection;