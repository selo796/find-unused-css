'use strict';

var ReactAttributeFinder = require('../../src/react/ReactAttributeFinder');
var test1Path = './specs/react/testFiles/test1.js';

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
        
});