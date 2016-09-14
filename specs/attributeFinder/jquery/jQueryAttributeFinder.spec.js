'use strict';

let JQueryAttributeFinder = require('../../../src/attributeFinder/jQuery');

describe('jQuery Attribute Finder Testing', function () {
    let s, util;
    beforeEach(()=> {
        s = new JQueryAttributeFinder();
    });
    it('should reject an error if css file not found', (done) => {

        s.findAttribute('wrongCssPath.js').then((selectors) => {
            expect(selectors).not.toBeDefined();
            done();
        }, (err) => {
            expect(err).toEqual('An error occurs while reading the file: wrongCssPath.js');
            done();
        });
    });

    it('should resolve empty array by looking "addClass" if no addClass found', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`function( index, currentClass ) {
                    var addedClass;
                    if ( currentClass === "red" ) {
                        addedClass = "green";
                        $( "p" ).text( "There is one green div" );
                    }
                    return addedClass;`
                );
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class : [  ], _id : [  ] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should resolve empty array by looking "addClass" with callback function', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`
                $( "div" ).addClass(function( index, currentClass ) {
                    var addedClass;
                    if ( currentClass === "red" ) {
                        addedClass = "green";
                        $( "p" ).text( "There is one green div" );
                    }
                    return addedClass;
                    });`
                );
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class : [  ], _id : [  ] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should find only one class from "addClass"', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p:last" ).addClass( "selected" );`
                );
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class : [ 'selected' ], _id : [  ] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should find all classes from "addClass"', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p:last" ).addClass( "selected highlight" );`
                );
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class : [ 'selected', 'highlight' ], _id : [  ] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should find all classes from "addClass" by using multiple line in addClass', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p:last" ).addClass( "selected
                secondClass" );`
                );
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class : [ 'selected', 'secondClass' ], _id : [  ] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });

    });

    xit('should resolve empty array found by looking "append(some html)"', (done) => {

    });

    xit('should return all attributes from addClass and append(someHtmlWithClass) "returns"', (done) => {

    });

    xit('should find all ids from append(someHtmlWithId)', (done) => {

    });

    xit('should ignore addClass and append comments ', (done) => {

    });
});