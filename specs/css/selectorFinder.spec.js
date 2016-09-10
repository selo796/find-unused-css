/* global require, describe, expect, it */
'use strict';

var SelectorFinder = require('../../src/css/selectorFinder');

describe('CSS-Selector Finder Testing', ()=> {

  describe('Find all css class selectors', ()=> {
    var s;

    beforeEach(()=> {
      s =  new SelectorFinder();
    });

    it('should find "row-wrapper"', ()=> {
      var foundCssSelectors = s.find('.row-wrapper {');
      expect(foundCssSelectors._class).toEqual(['row-wrapper']);
    });

    it('should find "row-wrapper and mytest"', ()=> {
      var foundCssSelectors = s.find('.row-wrapper.mytest {');
      expect(foundCssSelectors._class).toEqual(['row-wrapper', 'mytest']);
    });

    it('should find "hallo"', ()=> {
      var foundCssSelectors = s.find('td.hallo { 2. Prevent i,');
      expect(foundCssSelectors._class).toEqual(['hallo']);
    });

    it('should find "[]"', ()=> {
      var foundCssSelectors = s.find('2. Prevent iOS and IE,');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', ()=> {
      var foundCssSelectors = s.find('src: url("../ok/0c-da2.et?#ie");');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "myClass"', ()=> {
      var foundCssSelectors = s.find('.myClass:before {');
      expect(foundCssSelectors._class).toEqual(['myClass']);
    });

    it('should find "page--xyz" and "testClass1"', ()=> {
      var foundCssSelectors = s.find('body:not(.page--xyz) .testClass1 {');
      expect(foundCssSelectors._class).toEqual(['page--xyz', 'testClass1']);
    });

    it('should find "[]"', ()=> {
      var foundCssSelectors = s.find('url("//fast.fonts.net/");');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', ()=> {
      var foundCssSelectors = s.find('padding: 1em .71429em .92857em 0;');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', ()=> {
      var t = '/*! normalize-scss | MIT/GPLv2 License | bit.ly/xyz.css */';
      var foundCssSelectors = s.find(t);
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "xyz_abc" and "icon" ', ()=> {
      var foundCssSelectors = s.find('.xyz_abc .icon,');
      expect(foundCssSelectors._class).toEqual(['xyz_abc', 'icon']);
    });

    it('should find "xyz_abc" only one time ', ()=> {
      var foundCssSelectors = s.find('.xyz_abc .icon.xyz_abc,');
      expect(foundCssSelectors._class).toEqual(['xyz_abc', 'icon']);
    });

    it('should find "language" and "deactive" ', ()=> {
      var foundCssSelectors = s.find('.language span.deactive{');
      expect(foundCssSelectors._class).toEqual(['language', 'deactive']);
    });

  });

  describe('Find all css id selectors', ()=> {
    var s;

    beforeEach(()=> {
      s =  new SelectorFinder();
    });

    it('should find "myId" ', ()=> {
      var foundCssSelectors = s.find('#myId');
      expect(foundCssSelectors._id).toEqual(['myId']);
    });

    it('should find "onlyId" ', ()=> {
      var foundCssSelectors = s.find('#onlyId.icon');
      expect(foundCssSelectors._id).toEqual(['onlyId']);
    });

    it('should find "myId" "testID" ', ()=> {
      var foundCssSelectors = s.find('#myId.icon #testID');
      expect(foundCssSelectors._id).toEqual(['myId', 'testID']);
    });

    it('should find "myId-test" ', ()=> {
      var foundCssSelectors = s.find('#myId-test {');
      expect(foundCssSelectors._id).toEqual(['myId-test']);
    });


    it('should find "[]"', ()=> {
      var t = '   border: 1px solid #c0c0c0;';
      var foundCssSelectors = s.find(t);
      expect(foundCssSelectors._id).toEqual([]);
    });

    it('should find "[]"', ()=> {
      var t = '   border: 1px solid #c0c0c0 #ff0;';
      var foundCssSelectors = s.find(t);
      expect(foundCssSelectors._id).toEqual([]);
    });

    it('should find "[]"', ()=> {
      var t = '   background: -webkit-gradient(linear, left top,  from(#ebf2f8), to(#d8e6ef));';
      var foundCssSelectors = s.find(t);
      expect(foundCssSelectors._id).toEqual([]);
    });

  });

  describe('Find comments', () => {
    var s;

    beforeEach(()=> {
      s =  new SelectorFinder();
    });

    it('should find "[]"', () => {
      var comment = '/*';
      var foundCssSelectors = s.find(comment);
      comment = '* .xyz abc.html and test.html';
      foundCssSelectors = s.find(comment);
      comment = '*/';
      foundCssSelectors = s.find(comment);
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', () => {
      var comment = '/* .xyz abc.html and test.html';
      var foundCssSelectors = s.find(comment);
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', () => {
      var comment = '/* .xyz abc.html and test.html */';
      var foundCssSelectors = s.find(comment);
      expect(foundCssSelectors._class).toEqual([]);
    });
  });

  describe ('Find selectors in multiple css files', () => {
    var s;

    beforeEach(()=> {
      s =  new SelectorFinder();
    });

    it('should find selectors in single css file',  (done)=> {
      var cssFiles = './specs/css/testCssFiles/main.css';

      var promise = s.run(cssFiles);
      promise.then((result) => {
          expect(s.selectors._id).toEqual([ 'myTestID' ]);
          expect(s.selectors._class).toEqual( ['text-transform--none', 'myTestClass' ]);
          done();
      }, (err) => {
          expect(err).not.toBeDefined();
          done();
      });
    });

    it('should find selectors in multiple css file',  (done)=> {
      var cssFiles1 = './specs/css/testCssFiles/main.css';
      var cssFiles2 = './specs/css/testCssFiles/id.css';

      var promise1 = s.run(cssFiles1);
      var promise2 = s.run(cssFiles2);
      Promise.all([promise1, promise2]).then((result) => {
          expect(s.selectors._id).toEqual([ 'myTestID1', 'myTestID' ]);
          expect(s.selectors._class.length).toEqual(3);
          done();
      }, (err) => {
          expect(err).not.toBeDefined();
          done();
      });
    });

    it('should throw an error with "css file not found."', (done)=> {
      var cssFiles1 = './specs/css/testCssFiles/css_file_not_found.css';

      var promise1 = s.run(cssFiles1);
      promise1.then((result) => {
          expect(result).not.toBeDefined();
          done();
      }, (err) => {
          expect(err).toBeDefined();
          done();
      });
    });

  });
});
