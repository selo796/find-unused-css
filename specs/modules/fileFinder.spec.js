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

  it('should reject when directory not found', function(done) {
    var s =  new FileFinder();

    var promise = s.getFiles('./specs/modules/unknown', 'HTML');
    promise.then((result) => {
      expect(result).toEqual('No Result!');
      done();
    }, (err) => {
      expect(err).toEqual('Directory: "./specs/modules/unknown" not found!');
      done();
    });
  });

  it('should "not" filter ignored dirs', function(done) {
    var s =  new FileFinder();

    var promise = s.getFiles('./specs/modules/testHTMLFolder', 'HTML', []);
    promise.then((result) => {
      expect(result.length).toBe(6);
      done();
    }, (err) => {
      expect(err).toEqual('No Error!');
      done();
    });
  });

  it('should filter ignored dirs', function(done) {
    var s =  new FileFinder();

    var promise = s.getFiles('./', 'HTML', ['node_modules', 'coverage']);
    promise.then((result) => {
      expect(result.length).toBe(8);
      done();
    }, (err) => {
      expect(err).toEqual('No Error!');
      done();
    });
  });

  it('should filter ignored dirs', function(done) {
    var s =  new FileFinder();

    var promise = s.getFiles('./', 'HTML', ['./node_modules', './coverage']);
    promise.then((result) => {
      expect(result.length).toBe(8);
      done();
    }, (err) => {
      expect(err).toEqual('No Error!');
      done();
    });
  });
});
