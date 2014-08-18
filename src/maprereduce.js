'use strict';

(function(context) {
    
    var MapReReduce = function(mapFn, reduceFn, rereduceFn, initialResult) {
        if(!(mapFn instanceof Function)) {
            throw new Error('mapFn should be a function, e.g. function(key, value) {...}');
        }
        if(!(reduceFn instanceof Function)) {
            throw new Error('reduceFn should be a function, e.g. function(key, values) {...}');
        }
        if(!(rereduceFn instanceof Function)) {
            throw new Error('rereduceFn should be a function, e.g. function(value1, value2) {...}');
        }
        if(!(initialResult === undefined || initialResult === null || (initialResult instanceof Object && !initialResult instanceof Array))) {
            throw new Error('initialResult should be instance of Object');
        }
        this.tmp = {};
        this.result = initialResult || {};
        this.mapFn = mapFn;
        this.reduceFn = reduceFn;
        this.rereduceFn = rereduceFn;
    };
    
    MapReReduce.prototype = {
        feed: function(input) {
            var self = this;
            this.tmp = {};
            input.forEach(function(item) {
                var key = self.mapFn(item);                
                if(key instanceof Array) {
                    key.forEach(function(subkey) {
                        self._emit(subkey, item);
                    });
                }
                else {
                    self._emit(key, item);
                }                
            });
            this._reduce(this.tmp);
            return this;
        },
        _emit: function(key, value) {
            if(key !== undefined && key !== null) {
                if(!this.tmp[key]) {
                    this.tmp[key] = [];
                }
                this.tmp[key].push(value);
            }            
        },
        _reduce: function(input) {
            for(var key in input) {
                if(this.result[key]) {
                    this.result[key] = this.rereduceFn(this.result[key], this.reduceFn(input[key]));
                }
                else {
                    this.result[key] = this.reduceFn(input[key]);
                }              
            }
        }
    };
    
    if(module && module.exports) {
        module.exports = MapReReduce;
    }
    else if(define) {
        define('MapReReduce', function() {
            return MapReReduce;
        });
    }
    else {
        context.MapReReduce = MapReReduce;
    }    
})(this);