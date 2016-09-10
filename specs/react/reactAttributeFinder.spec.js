'use strict';

var ReactAttributeFinder = require('../../src/react/reactAttributeFinder');
var test1Path = './specs/react/testFiles/test1.js';
var containsNoRender = './specs/react/testFiles/containsNoRender.js';

describe('React Attribute Finder Testing', function() {

    it('should find all classes', (done) => {
        var s = new ReactAttributeFinder();
        s.run(test1Path).then((selectors) => {
            expect(selectors._class).toEqual(['row', 'col-lg-6', 'btn-group', 'pull-right', 'show', 'hidden', 'btn', 'btn-default',
            'dropdown-toggle', 'caret', 'dropdown-menu', 'divider']);
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should return empty arrays', (done) => {
        var s = new ReactAttributeFinder();
        s.run(containsNoRender).then((selectors) => {
            expect(selectors._class).toEqual([]);
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

});