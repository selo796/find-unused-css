'use strict';

var Scanner = require('../src/scanner');

describe('Scanner Testing', function() {

    it('should return an error if no config obj exists', ()=> {
      var s =  new Scanner();
      expect(function() {s.run();})
        .toThrow(new Error('Config file is not found.'));
    });

    it('should return an error if htmlDirectory is not defined', ()=> {
      var s =  new Scanner({htmlWrong: './'});
      expect(function() {s.run();})
        .toThrow(
          new Error(
          'Please check your config file. No htmlDirectory is defined.'));
    });

    it('should return an error if cssFiles in config file not exists', ()=> {
      var s =  new Scanner({htmlDirectory: './', cssFilesWrong: ['asd']});
      expect(function() {s.run();})
      .toThrow(
        new Error('Please check your config file. No cssFiles is defined.'));
    });

    it('should return an empty object if no html files found', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './src',
          cssFiles: ['./specs/css/testCssFiles/id.css'],});
      s.run().then((result)=> {
        expect(result).toEqual({});
        done();
      }, (err)=> {
        expect(err).not.toBeDefined();
        done();
      });
    });

    it('should reject when directory not found', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './src/unknown',
          cssFiles: ['./specs/css/testCssFiles/id.css'],});
      s.run().then((result)=> {
        expect(result).not.toBeDefined({});
        done();
      }, (err)=> {
        expect(err).toEqual('Directory: "./src/unknown" not found!');
        done();
      });
    });

    it('should return all unused id and class selectors', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './specs/html/testAttributeFinderInHtml',
          cssFiles: ['./specs/css/testCssFiles/id.css'],});
      s.run().then((result)=> {
        expect(result).toEqual(
          { totalNumberOfHtmlFiles: 2,
            totalNumberOfClassSelectors: 1,
            numberOfUnusedCssClasses: 1,
            totalNumberOfIdSelectors: 2,
            numberOfUnusedIds: 2, });
        done();
      }, (err)=> {
        expect(err).not.toBeDefined({});
        done();
      });
    });
  });
