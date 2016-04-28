'use strict';

require('babel-core/register');

var fileFinder = require( '../../src/modules/fileFinder');

describe('File Finder Testing', function() {

	it('should find all html files in testHTMLFolder', function(done) {
    var s =  new fileFinder();

    var promise = s.getFiles( './specs/modules/testHTMLFolder', 'HTML');
    promise.then(function (result) {
        expect(result.length).toBe(6);
        done();
    }, function (err){
        expect(err).toEqual('No Error!');
        done();
    });
	});
});
