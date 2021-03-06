'use strict';

var ReactAttributeFinder = require('../../../src/attributeFinder/react');
var test1Path = './specs/attributeFinder/react/testFiles/test1.js';
var testWithID = './specs/attributeFinder/react/testFiles/testWithID.js';
var multipleReturnPath = './specs/attributeFinder/react/testFiles/multipleReturns.js';
var containsNoRender = './specs/attributeFinder/react/testFiles/containsNoRender.js';
var noHTMLinReturnPath = './specs/attributeFinder/react/testFiles/noHTMLinReturn.js';

describe('React Attribute Finder Testing', function () {

    it('should reject an error if css file not found', (done) => {
        var s = new ReactAttributeFinder();
        s.findAttribute('wrongCssPath.css').then((selectors) => {
            expect(selectors).not.toBeDefined();
            done();
        }, (err) => {
            expect(err).toEqual('An error occurs while reading the file: wrongCssPath.css');
            done();
        });
    });

    it('should resolve empty array if not html in return', (done) => {
        var s = new ReactAttributeFinder();
        s.findAttribute(noHTMLinReturnPath).then((selectors) => {
            expect(selectors._class).toEqual([]);
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should find all classes', (done) => {
        var s = new ReactAttributeFinder();
        s.findAttribute(test1Path).then((selectors) => {
            expect(selectors._class).toEqual(['row', 'react-main', 'col-lg-6', 'btn-group', 'pull-right', 'show', 'hidden', 'btn', 'btn-default',
                'dropdown-toggle', 'caret', 'dropdown-menu', 'divider']);
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should return empty arrays', (done) => {
        var s = new ReactAttributeFinder();
        s.findAttribute(containsNoRender).then((selectors) => {
            expect(selectors._class).toEqual([]);
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should return all attributes from multiple "returns"', (done) => {
        var s = new ReactAttributeFinder();
        s.findAttribute(multipleReturnPath).then((selectors) => {
            expect(selectors._class).toEqual(['App', 'Master', 'Detail']);
            expect(selectors._id).toEqual([]);
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });

    });

    it('should find all ids', (done) => {
        var s = new ReactAttributeFinder();
        s.findAttribute(testWithID).then((selectors) => {
            expect(selectors._class).toEqual(['divider']);
            expect(selectors._id).toEqual(['my-id1', 'my-id2']);
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });
});