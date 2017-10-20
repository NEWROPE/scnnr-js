'use strict'

const axios = require('axios')

class Connection {
  constructor({ url, version, key, timeout }) {
    this.axiosInstance = axios.create()

    this.axiosInstance.defaults.baseURL = url + version
    this.axiosInstance.defaults.headers.post['x-api-key'] = key

    if(timeout > 0) {
      this.axiosInstance.defaults.params = {} // create default params
      this.axiosInstance.defaults.params['timeout'] = timeout
    }
  }

  sendJson(path, data) {
    return new Promise( (resolve, reject) => { 
      this.axiosInstance.post(path, data, { headers: { 'Content-Type': 'application/json' } })
        .then( response => {
          resolve(response.data)
        })
        .catch ( error => { 
          reject({} || error.response.error)
        })
    })
  }
}

module.exports = Connection
