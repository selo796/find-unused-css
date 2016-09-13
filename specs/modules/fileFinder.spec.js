'use strict';

var FileFinder = require('../../src/modules/fileFinder');

describe('File Finder Testing', function () {

  it('should find all html files in testHTMLFolder', function (done) {
    var s = new FileFinder();

    var promise = s.getFiles(['./specs/modules/testHTMLFolder/**/*.html'], ['HTML']);
    promise.then((result) => {
      expect(result.length).toBe(6);
      done();
    }, (err) => {
      expect(err).toEqual('No Error!');
      done();
    });
  });

  it('should reject when no directory given', function (done) {
    var s = new FileFinder();

    var promise = s.getFiles([], ['HTML']);
    promise.then((result) => {
      expect(result).toEqual('No Result!');
      done();
    }, (err) => {
      expect(err).toEqual('Please check your configuration for HTML', ['HTML']);
      done();
    });
  });

  it('should reject when directory not found', function (done) {
    var s = new FileFinder();

    var promise = s.getFiles(['./specs/modules/unknown/*.html'], ['HTML']);
    promise.then((result) => {
      expect(result).toEqual('No Result!');
      done();
    }, (err) => {
      expect(err).toEqual('Looking for file extension:HTML, but no files found in: "./specs/modules/unknown/*.html"', ['HTML']);
      done();
    });
  });

  it('should "not" filter ignored dirs', function (done) {
    var s = new FileFinder();

    var promise = s.getFiles(['./specs/modules/testHTMLFolder/**/*.html'], ['HTML'], []);
    promise.then((result) => {
      expect(result.length).toBe(6);
      done();
    }, (err) => {
      expect(err).toEqual('No Error!');
      done();
    });
  });

  it('should filter ignored dirs', function (done) {
    var s = new FileFinder();

    var promise = s.getFiles(['./**/*.html'], ['HTML'], ['node_modules', 'coverage']);
    promise.then((result) => {
      expect(result.length).toBe(8);
      done();
    }, (err) => {
      expect(err).not.toBeDefined();
      done();
    });
  });

  it('should reject when searching for html in js files', function (done) {
    var s = new FileFinder();

    var promise = s.getFiles(['./**/*.js'], ['HTML']);
    promise.then((result) => {
      expect(result.length).toBe(8);
      done();
    }, (err) => {
      expect(err).toEqual('Looking for file extension:HTML, but no files found in: "./**/*.js"');
      done();
    });
  });
});
