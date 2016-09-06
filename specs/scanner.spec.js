'use strict';

var Scanner = require('../src/scanner');

describe('Scanner Testing', function() {

    it('should return an error if no config obj exists', (done)=> {
      var s =  new Scanner();
      s.run().then((result)=> {
        expect(result).not.toBeDefined({});
        done();
      }, (err)=> {
        expect(err)
          .toEqual('Config file is not found.');
        done();
      });
    });

    it('should return an error if htmlDirectory is not defined', (done)=> {
      var s =  new Scanner({htmlWrong: './'});
      s.run().then((result)=> {
        expect(result).not.toBeDefined({});
        done();
      }, (err)=> {
        expect(err)
          .toEqual('Please check your config file. No htmlDirectory is defined.');
        done();
      });
    });

    it('should return an error if cssFiles in config file not exists', (done)=> {
      var s =  new Scanner({htmlDirectory: './', cssFilesWrong: ['asd']});
      s.run().then((result)=> {
        expect(result).not.toBeDefined({});
        done();
      }, (err)=> {
        expect(err)
          .toEqual('Please check your config file. No cssFiles is defined.');
        done();
      });
    });

    it('should reject if no html files found', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './src',
          cssFiles: ['./specs/css/testCssFiles/id.css'],});
      s.run().then((result)=> {
        expect(result).not.toBeDefined();
        done();
      }, (err)=> {
        expect(err).toEqual('Looking for file extension:HTML, but no files found in: "./src"');
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
        expect(err).toEqual('Looking for file extension:HTML, but no files found in: "./src/unknown"');
        done();
      });
    });

    it('should return all unused id and class selectors', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './specs/html/testAttributeFinderInHtml/**/*.html',
          cssFiles: ['./specs/css/testCssFiles/id.css'],});
      s.run().then((result)=> {
        expect(result).toEqual(
          { totalNumberOfHtmlFiles: 2,
            totalNumberOfClassSelectors: 1,
            totalNumberOfIdSelectors: 2,
            numberOfUnusedIds: 2,
            unusedClasses: [ 'myClass' ],
            unusedIds: [ 'myTestID1', 'myTestID' ], });
        done();
      }, (err)=> {
        expect(err).not.toBeDefined({});
        done();
      });
    });

    it('should return all unused id and class selectors by using glob', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './specs/html/testAttributeFinderInHtml/**/*.html',
          cssFiles: ['./specs/css/**/*.css'],});
      s.run().then((result)=> {
        expect(result).toEqual(
          { totalNumberOfHtmlFiles: 2,
            totalNumberOfClassSelectors: 3,
            totalNumberOfIdSelectors: 2,
            numberOfUnusedIds: 2,
            unusedClasses: [ 'text-transform--none', 'myClass', 'myTestClass' ],
            unusedIds: [ 'myTestID1', 'myTestID' ], });
        done();
      }, (err)=> {
        expect(err).not.toBeDefined({});
        done();
      });
    });

    it('should return all unused id and class selectors by using glob', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './specs/html/testAttributeFinderInHtml/**/*.html',
          cssFiles: ['./specs/css/**/id.css', './specs/css/**/main.css'],});
      s.run().then((result)=> {
        expect(result).toEqual(
          { totalNumberOfHtmlFiles: 2,
            totalNumberOfClassSelectors: 3,
            totalNumberOfIdSelectors: 2,
            numberOfUnusedIds: 2,
            unusedClasses: [ 'text-transform--none', 'myClass', 'myTestClass' ],
            unusedIds: [ 'myTestID1', 'myTestID' ], });
        done();
      }, (err)=> {
        expect(err).not.toBeDefined({});
        done();
      });
    });

    it('should reject by using also wrong glob', (done)=> {
      var s =  new Scanner(
        {
          htmlDirectory: './specs/html/testAttributeFinderInHtml/**/*.html',
          cssFiles: ['./specs/css/**/*.css', './specs/css/**/*.HTML'],});
      s.run().then((result)=> {
        expect(result).not.toBeDefined({});
        
        done();
      }, (err)=> {
        expect(err).toBeDefined({});
        done();
      });
    });
  });
