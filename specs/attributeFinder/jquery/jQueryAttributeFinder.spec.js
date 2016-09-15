'use strict';

let JQueryAttributeFinder = require('../../../src/attributeFinder/jQuery');

describe('jQuery Attribute Finder Testing', function () {
    let s, util;
    beforeEach(() => {
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
            expect(selectors).toEqual({ _class: [], _id: [] });
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
            expect(selectors).toEqual({ _class: [], _id: [] });
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
            expect(selectors).toEqual({ _class: ['selected'], _id: [] });
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
            expect(selectors).toEqual({ _class: ['selected', 'highlight'], _id: [] });
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
            expect(selectors).toEqual({ _class: ['selected', 'secondClass'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });

    });

    it('should find all classes from "addClass" by using multiple addClasses', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p:last" ).addClass( "selected
                secondClass" );
                $( "p:last" ).addClass( "selected1
                secondClass1" );`
                );
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['selected', 'secondClass', 'selected1', 'secondClass1'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });

    });

    it('should find all classes from "addClass" by using multiple addClasses but only once', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p:last" ).addClass( "selected secondClass" );
                $( "p:last" ).addClass( "selected
                secondClass" );`
                );
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['selected', 'secondClass'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });

    });

    it('should resolve empty array found by looking "append(some html)" which does not have class attr', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p" ).append("<strong>Hello</strong>" );`);
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: [], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should return one class attribute from append(someHtmlWithClass)', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p" ).append("<strong class="selected">Hello</strong>" );`);
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['selected'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should return all class attributes from append', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p" ).append("
                <strong class="selected secondClass">Hello</strong>
                <div class="selected1 secondClass1">Hello</div>
                " );`);
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['selected', 'secondClass', 'selected1', 'secondClass1'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should find all classes from "append" by using multiple append but only once', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p" ).append("
                <strong class="selected secondClass">Hello</strong>
                <div class="selected secondClass">Hello</div>
                " );`);
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['selected', 'secondClass'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });

    });

    it('should find all ids from append(someHtmlWithId)', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p" ).append("
                <strong class="selected secondClass">Hello</strong>
                <div id="myId" class="selected secondClass">Hello</div>
                <div id="myId2">Hello</div>
                " );`);
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['selected', 'secondClass'], _id: ['myId', 'myId2'] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should ignore addClass and append comments ', (done) => {
        s.findAttribute('./specs/attributeFinder/jquery/testFiles/fileWithComment.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['X', 'Y', 'selected', 'secondClass'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });

    it('should return all attributes from addClass and append', (done) => {
        spyOn(s._util, 'readFile').andReturn(
            new Promise((resolve, reject) => {
                resolve(`$( "p" ).append("
                <strong class="selected secondClass">Hello</strong>
                <div class="selected secondClass">Hello</div>
                " );
                $( "p:last" ).addClass( "X Y" );
                `);
            })
        );
        s.findAttribute('some.js').then((selectors) => {
            expect(selectors).toEqual({ _class: ['X', 'Y', 'selected', 'secondClass'], _id: [] });
            done();
        }, (err) => {
            expect(err).not.toBeDefined();
            done();
        });
    });
});