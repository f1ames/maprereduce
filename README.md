## maprereduce.js [![Build Status](https://travis-ci.org/f1ames/maprereduce.svg?branch=master)](https://travis-ci.org/f1ames/maprereduce)

Install
===

To install current release from npm, run:

    npm install maprereduce
    
Use
===

You can load this module, like every standard npm module:

    var maprereduce = require('maprereduce');
    
And then you need to implement 3 functions:

    var mr = new maprereduce(function(item) {
        // Your map function
    }, function(result) {
        // Your reduce function
    }, function(item1, item2) {
        // Your rereduce function
    });