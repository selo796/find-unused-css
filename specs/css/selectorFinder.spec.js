/* global require, describe, expect, it */
'use strict';

require('babel-core/register');

var SelectorFinder = require('../../src/css/selectorFinder');

describe('CSS-Selector Finder Testing', function () {

  describe('Find all css class selectors', function () {
    var s;

    beforeEach(function () {
      s =  new SelectorFinder();
    });

    it('should find "row-wrapper"', function () {
      var foundCssSelectors = s.findCssSelectors('.row-wrapper {');
      expect(foundCssSelectors._class).toEqual(['row-wrapper']);
    });

    it('should find "row-wrapper and mytest"', function () {
      var foundCssSelectors = s.findCssSelectors('.row-wrapper.mytest {');
      expect(foundCssSelectors._class).toEqual(['row-wrapper', 'mytest']);
    });

    it('should find "hallo"', function () {
      var foundCssSelectors = s.findCssSelectors('td.hallo { 2. Prevent i,');
      expect(foundCssSelectors._class).toEqual(['hallo']);
    });

    it('should find "[]"', function () {
      var foundCssSelectors = s.findCssSelectors('2. Prevent iOS and IE,');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', function () {
      var foundCssSelectors = s.findCssSelectors('src: url("../ok/0c-da2.et?#ie");');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "myClass"', function () {
      var foundCssSelectors = s.findCssSelectors('.myClass:before {');
      expect(foundCssSelectors._class).toEqual(['myClass']);
    });

    it('should find "page--xyz" and "testClass1"', function () {
      var foundCssSelectors = s.findCssSelectors('body:not(.page--xyz) .testClass1 {');
      expect(foundCssSelectors._class).toEqual(['page--xyz', 'testClass1']);
    });

    it('should find "[]"', function () {
      var foundCssSelectors = s.findCssSelectors('url("//fast.fonts.net/");');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', function () {
      var foundCssSelectors = s.findCssSelectors('padding: 1em .71429em .92857em 0;');
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', function () {
      var t = '/*! normalize-scss | MIT/GPLv2 License | bit.ly/xyz.css */';
      var foundCssSelectors = s.findCssSelectors(t);
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "xyz_abc" and "icon" ', function () {
      var foundCssSelectors = s.findCssSelectors('.xyz_abc .icon,');
      expect(foundCssSelectors._class).toEqual(['xyz_abc', 'icon']);
    });

    it('should find "xyz_abc" only one time ', function () {
      var foundCssSelectors = s.findCssSelectors('.xyz_abc .icon.xyz_abc,');
      expect(foundCssSelectors._class).toEqual(['xyz_abc', 'icon']);
    });

    it('should find "language" and "deactive" ', function () {
      var foundCssSelectors = s.findCssSelectors('.language span.deactive{');
      expect(foundCssSelectors._class).toEqual(['language', 'deactive']);
    });



  });

  describe('Find all css id selectors', function () {
    var s;

    beforeEach(function () {
      s =  new SelectorFinder();
    });

    it('should find "myId" ', function () {
      var foundCssSelectors = s.findCssSelectors('#myId');
      expect(foundCssSelectors._id).toEqual(['myId']);
    });

    it('should find "onlyId" ', function () {
      var foundCssSelectors = s.findCssSelectors('#onlyId.icon');
      expect(foundCssSelectors._id).toEqual(['onlyId']);
    });

    it('should find "myId" "testID" ', function () {
      var foundCssSelectors = s.findCssSelectors('#myId.icon #testID');
      expect(foundCssSelectors._id).toEqual(['myId', 'testID']);
    });

    it('should find "[]"', function () {
      var t = '   border: 1px solid #c0c0c0;';
      var foundCssSelectors = s.findCssSelectors(t);
      expect(foundCssSelectors._id).toEqual([]);
    });

    it('should find "[]"', function () {
      var t = '   border: 1px solid #c0c0c0 #ff0;';
      var foundCssSelectors = s.findCssSelectors(t);
      expect(foundCssSelectors._id).toEqual([]);
    });

    it('should find "[]"', function () {
      var t = '   background: -webkit-gradient(linear, left top,  from(#ebf2f8), to(#d8e6ef));';
      var foundCssSelectors = s.findCssSelectors(t);
      expect(foundCssSelectors._id).toEqual([]);
    });

  });

  describe('Find comments', () => {
    var s;

    beforeEach(function () {
      s =  new SelectorFinder();
    });

    it('should find "[]"', () => {
      var comment = '/*';
      var foundCssSelectors = s.findCssSelectors(comment);
      comment = '* .xyz abc.html and test.html';
      foundCssSelectors = s.findCssSelectors(comment);
      comment = '*/';
      foundCssSelectors = s.findCssSelectors(comment);
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', () => {
      var comment = '/* .xyz abc.html and test.html';
      var foundCssSelectors = s.findCssSelectors(comment);
      expect(foundCssSelectors._class).toEqual([]);
    });

    it('should find "[]"', () => {
      var comment = '/* .xyz abc.html and test.html */';
      var foundCssSelectors = s.findCssSelectors(comment);
      expect(foundCssSelectors._class).toEqual([]);
    });
  });
});
