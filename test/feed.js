var assert = require('assert');
var mr = require('../release/maprereduce.min.js');

describe('maprereduce', function(){
    describe('#feed()', function(){
        
        it("should throw error when mapFn param undefined", function() {
            assert.throws(function() {
                new mr();
            }, /mapFn/);
        });
        
        it("should throw error when reduceFn param undefined", function() {
            assert.throws(function() {
                new mr(function(){});
            }, /reduceFn/);
        });
        
        it("should throw error when rereduceFn param undefined", function() {
            assert.throws(function() {
                new mr(function(){}, function(){});
            }, /rereduceFn/);
        });
        
         it("should throw error when initialResult param is defined and not an Object", function() {
            assert.throws(function() {
                new mr(function(){}, function(){}, function() {}, []);
            }, /initialResult/);
        });
        
        it("should return {3: 2} for ['the', 'and']", function() {
            var samples = ['the', 'and'];
            var mapreduce = new mr(function(str) {
                return str.length;
            }, function(arr) {
                return arr.length;
            }, function(){});
            assert.deepEqual(mapreduce.feed(samples).result, {3: 2});
        });
        
        it("should return {3: 3, 4: 3, 5: 2, 8: 2} for ['the', 'and', 'you', 'then', 'what', 'when', 'steve', 'where', 'savannah', 'research']", function() {
            var samples = ['the', 'and', 'you', 'then', 'what', 'when', 'steve', 'where', 'savannah', 'research'];
            var mapreduce = new mr(function(str) {
                return str.length;
            }, function(arr) {
                return arr.length;
            }, function(){});
            assert.deepEqual(mapreduce.feed(samples).result, {3: 3, 4: 3, 5: 2, 8: 2});
        });
        
        it("should return {1:3, 2:1, 3:1, 9:1, 'A':3, 'B':2, 'C':1} for [['A', 1, 123],['B', 1, 123],['C', 1, 123],['A', 2, 123],['A', 3, 123],['B', 9, 123]]", function() {
            var samples = [['A', 1, 123],['B', 1, 123],['C', 1, 123],['A', 2, 123],['A', 3, 123],['B', 9, 123]];
            var mapreduce = new mr(function(item) {
                return [item[0], item[1]];
            }, function(item) {
                return item.length;
            }, function(){});
            assert.deepEqual(mapreduce.feed(samples).result, {1:3, 2:1, 3:1, 9:1, 'A':3, 'B':2, 'C':1});
        });
        
        it("should return {3: 3, 4: 3, 5: 2, 8: 2} for ['the', 'and', 'you', 'then'] and ['what', 'when', 'steve', 'where', 'savannah', 'research']", function() {
            var samples1 = ['the', 'and', 'you', 'then'];
            var samples2 = ['what', 'when', 'steve', 'where', 'savannah', 'research'];            
            var mapreduce = new mr(function(str) {
                return str.length;
            }, function(arr) {
                return arr.length;
            }, function(item1, item2) {
                return item1 + item2;
            });
            assert.deepEqual(mapreduce.feed(samples1).feed(samples2).result, {3: 3, 4: 3, 5: 2, 8: 2});
        });
        
        it("should return {1:3, 2:1, 3:1, 9:1, 'A':3, 'B':2, 'C':1} for [['A', 1, 123],['B', 1, 123]] and [['C', 1, 123],['A', 2, 123],['A', 3, 123],['B', 9, 123]]", function() {
            var samples1 = [['A', 1, 123],['B', 1, 123]];
            var samples2 = [['C', 1, 123],['A', 2, 123],['A', 3, 123],['B', 9, 123]];
            var mapreduce = new mr(function(item) {
                return [item[0], item[1]];
            }, function(item) {
                return item.length;
            }, function(item1, item2) {
                return item1 + item2;
            });
            assert.deepEqual(mapreduce.feed(samples1).feed(samples2).result, {1:3, 2:1, 3:1, 9:1, 'A':3, 'B':2, 'C':1});
        });
        
        it("should return {1: {1:3}, 2: {2:1, 3:1}, 3: {3:1}, 4:{4:1}} for ...", function() {
            var samples1 = [{'ip': 1, 'log': {'err': 1}}, {'ip': 2, 'log': {'err': 2}}, {'ip': 3, 'log': {'err': 3}}, {'ip': 1, 'log': {'err': 1}}];
            var samples2 = [{'ip': 1, 'log': {'err': 1}}, {'ip': 2, 'log': {'err': 3}}, {'ip': 4, 'log': {'err': 4}}];
            var mapreduce = new mr(function(item) {
                return item.ip;
            }, function(list) {
                var errors = {};
                list.forEach(function(item) {            
                    if(item.log.err) {
                        errors[item.log.err] = (errors[item.log.err] || 0) + 1;
                    }
                });
                return errors;
            }, function(item1, item2) {
                for(var i in item2) {
                    item1[i] = (item1[i] || 0) + item2[i];
                }
                return item1;
            });
            assert.deepEqual(mapreduce.feed(samples1).feed(samples2).result, {1: {1:3}, 2: {2:1, 3:1}, 3: {3:1}, 4:{4:1}});
        });
        
    });
});