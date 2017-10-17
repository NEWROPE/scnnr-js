"use strict";
const scnnr = require('../lib/scnnr');

// my secret API key
const key = require('./secret-key');

// example code
let myClient = new scnnr.Client({ key });

myClient.recognizeUrl("http://tokyofashion.com/wp-content/uploads/2017/10/TK-2017-09-09-016-001-Harajuku.jpg");