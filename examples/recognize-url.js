"use strict";
const scnnr = require('../lib/scnnr');

// my secret API key
const key = require('./secret-key');

// example code
let myClient = new scnnr.Client({ key });

myClient.recognizeUrl("https://res.cloudinary.com/cubki/image/upload/t_sp_standard/v1506724245/mmtzpbf8o6gc4ci57svb.jpg")
.then(result => {
    let prettyResult = JSON.stringify(result, null, 2);
    console.log(prettyResult);
})
.catch(error => {
    console.log(error);
})