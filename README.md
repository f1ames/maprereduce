maprereduce [![Build Status](https://travis-ci.org/f1ames/maprereduce.svg?branch=master)](https://travis-ci.org/f1ames/maprereduce)
===

Simple mapreduce implementation with additional rereduce step and filtering. Can be use in node or in browser (AMD or standalone).

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
    
To feed maprereduce with data, use:
    
    mr.feed(data); // data is Array
    
And to get results (at any time), use:
    
    var result = mr.result;
    
Filtering values
---

Normally the value returned by map function is used as a key in resulting object. If the returned value is === undefined or null, the key and all releated values will be filtered and will not occur in resulting object, e.g.

    var map = function(item) {
        return item.length > 2 ? item.length : null; // So all items shorter than 3 will be filtered
    }