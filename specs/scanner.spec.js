'use strict';

var Scanner = require('../src/scanner');

describe('Scanner Testing', function () {

  it('should return an error if no config obj exists', (done) => {
    var s = new Scanner();
    s.run().then((result) => {
      expect(result).not.toBeDefined({});
      done();
    }, (err) => {
      expect(err)
        .toEqual('Config file is not found.');
      done();
    });
  });

  it('should return an error if "source_files" is not defined', (done) => {
    var s = new Scanner({ htmlWrong: ['./'] });
    s.run().then((result) => {
      expect(result).not.toBeDefined({});
      done();
    }, (err) => {
      expect(err)
        .toEqual('Please check your config file. No source_files is defined.');
      done();
    });
  });

  it('should return an error if cssFiles in config file not exists', (done) => {
    var s = new Scanner({ source_files: ['./'], cssFilesWrong: ['asd'] });
    s.run().then((result) => {
      expect(result).not.toBeDefined({});
      done();
    }, (err) => {
      expect(err)
        .toEqual('Please check your config file. No cssFiles is defined.');
      done();
    });
  });

  it('should reject if no html files found', (done) => {
    var s = new Scanner(
      {
        source_files: ['./src'],
        cssFiles: ['./specs/css/testCssFiles/id.css'],
      });
    s.run().then((result) => {
      expect(result).not.toBeDefined();
      done();
    }, (err) => {
      expect(err).toEqual('Looking for file extension:HTML, but no files found in: "./src"');
      done();
    });
  });

  it('should reject when directory not found', (done) => {
    var s = new Scanner(
      {
        source_files: ['./src/unknown'],
        cssFiles: ['./specs/css/testCssFiles/id.css'],
      });
    s.run().then((result) => {
      expect(result).not.toBeDefined({});
      done();
    }, (err) => {
      expect(err).toEqual('Looking for file extension:HTML, but no files found in: "./src/unknown"');
      done();
    });
  });

  it('should return all unused id and class selectors', (done) => {
    var s = new Scanner(
      {
        source_files: ['./specs/attributeFinder/html/testAttributeFinderInHtml/**/*.html'],
        cssFiles: ['./specs/css/testCssFiles/id.css'],
      });
    s.run().then((result) => {
      expect(result).toEqual(
        {
          totalNumberOfScannedFiles: 2,
          totalNumberOfClassSelectors: 1,
          totalNumberOfIdSelectors: 2,
          numberOfUnusedIds: 2,
          unusedClasses: ['myClass'],
          unusedIds: ['myTestID1', 'myTestID'],
        });
      done();
    }, (err) => {
      expect(err).not.toBeDefined({});
      done();
    });
  });

  it('should return all unused id and class selectors by using glob', (done) => {
    var s = new Scanner(
      {
        source_files: ['./specs/attributeFinder/html/testAttributeFinderInHtml/**/*.html'],
        cssFiles: ['./specs/css/**/main.css', './specs/css/**/id.css']
      });
    const expectedResult = {
        totalNumberOfScannedFiles: 2,
        totalNumberOfClassSelectors: 3,
        totalNumberOfIdSelectors: 2,
        numberOfUnusedIds: 2,
        unusedClasses: ['text-transform--none', 'myClass', 'myTestClass'],
        unusedIds: ['myTestID1', 'myTestID'],
      };
    s.run().then((result) => {
      expect(expectedResult.totalNumberOfScannedFiles).toEqual(result.totalNumberOfScannedFiles);
      expect(expectedResult.totalNumberOfClassSelectors).toEqual(result.totalNumberOfClassSelectors);
      expect(expectedResult.totalNumberOfIdSelectors).toEqual(result.totalNumberOfIdSelectors);
      expect(expectedResult.numberOfUnusedIds).toEqual(result.numberOfUnusedIds);

      expect(expectedResult.unusedClasses.length).toEqual(result.unusedClasses.length);
      expect(result.unusedClasses.indexOf('text-transform--none') > -1).toBeTruthy();
      expect(result.unusedClasses.indexOf('myClass') > -1).toBeTruthy();
      expect(result.unusedClasses.indexOf('myTestClass') > -1).toBeTruthy();

      expect(expectedResult.unusedIds.length).toEqual(result.unusedIds.length);
      expect(result.unusedIds.indexOf('myTestID') > -1).toBeTruthy();
      expect(result.unusedIds.indexOf('myTestID1') > -1).toBeTruthy();
      done();
    }, (err) => {
      expect(err).not.toBeDefined({});
      done();
    });
  });

  it('should reject by using also wrong glob', (done) => {
    var s = new Scanner(
      {
        source_files: ['./specs/attributeFinder/html/testAttributeFinderInHtml/**/*.html'],
        cssFiles: ['./specs/css/**/id.css', './specs/css/**/*.html'],
      });
    s.run().then((result) => {
      expect(result).toEqual({
        totalNumberOfScannedFiles: 2,
        totalNumberOfClassSelectors: 1,
        totalNumberOfIdSelectors: 2,
        numberOfUnusedIds: 2,
        unusedClasses: ['myClass'],
        unusedIds: ['myTestID1', 'myTestID']
      });
      done();
    }, (err) => {
      expect(err).not.toBeDefined({});
      done();
    });
  });

  it('should return all unused id and class selectors by using html as well as react files', (done) => {
    var reactFilePath = './specs/attributeFinder/react/testFiles/test1.js';
    var s = new Scanner({
      source_files: ['./specs/attributeFinder/html/testAttributeFinderInHtml/**/*.html', reactFilePath],
      cssFiles: ['./specs/css/**/id.css', './specs/css/**/main.css', './specs/css/**/react.css'],
      options: {
        reactAnalyzing: true
      }
    });
    const expectedResult = {
      totalNumberOfScannedFiles: 3,
      totalNumberOfClassSelectors: 5,
      totalNumberOfIdSelectors: 2,
      numberOfUnusedIds: 2,
      unusedClasses: ['text-transform--none', 'myClass', 'myTestClass', 'react-main-one'],
      unusedIds: ['myTestID1', 'myTestID'],
    }
    s.run().then((result) => {
      expect(expectedResult.totalNumberOfScannedFiles).toEqual(result.totalNumberOfScannedFiles);
      expect(expectedResult.totalNumberOfClassSelectors).toEqual(result.totalNumberOfClassSelectors);
      expect(expectedResult.totalNumberOfIdSelectors).toEqual(result.totalNumberOfIdSelectors);
      expect(expectedResult.numberOfUnusedIds).toEqual(result.numberOfUnusedIds);

      expect(expectedResult.unusedClasses.length).toEqual(result.unusedClasses.length);
      expect(result.unusedClasses.indexOf('text-transform--none') > -1).toBeTruthy();
      expect(result.unusedClasses.indexOf('myClass') > -1).toBeTruthy();
      expect(result.unusedClasses.indexOf('myTestClass') > -1).toBeTruthy();
      expect(result.unusedClasses.indexOf('react-main-one') > -1).toBeTruthy();

      expect(expectedResult.unusedIds.length).toEqual(result.unusedIds.length);
      expect(result.unusedIds.indexOf('myTestID') > -1).toBeTruthy();
      expect(result.unusedIds.indexOf('myTestID1') > -1).toBeTruthy();
      done();
    }, (err) => {
      expect(err).not.toBeDefined();
      done();
    });
  });

  it('should reject when file not found', function (done) {
    var s = new Scanner({
        source_files: ['./specs/attributeFinder/html/testAttributeFinderInHtml/**/*.html'],
        cssFiles: ['./specs/css/myCss/id.css']
      });

      s.run().then((result) => {
        expect(result).not.toBeDefined();
        done();
      }, (err) => {
        expect(err).toBe('Looking for file extension:CSS, but no files found in: "./specs/css/myCss/id.css"');
        done();
      });
  });
});