'use strict';

var Strategy = require('../../src/attributeFinder/strategy').AbstractAttributeFinder;

describe('Attribute finder strategy testing', () => {

    it('should throw error when create a new instance directly from abstract class', (done) => {
        var s = new Strategy();
        try {
            s.findAttribute();
            expect(true).toEqual(false);
        } catch(err) {
            expect(err).toBeDefined();
            done();
        }
    });

});
