'use strict';

var FileFinder = require('../../src/modules/fileFinder');

describe('File Finder Testing', function() {

  it('should find all html files in testHTMLFolder', function(done) {
    var s =  new FileFinder();

    var promise = s.getFiles('./specs/modules/testHTMLFolder', 'HTML');
    promise.then((result) => {
      expect(result.length).toBe(6);
      done();
    }, (err) => {
      expect(err).toEqual('No Error!');
      done();
    });
  });
});
