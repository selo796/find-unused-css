'use strict';

var Util = require('../../src/modules/util');

describe('Utility Testing', ()=> {
    let u;
    beforeEach(()=>{
        u =  new Util();
    });
    describe('findHTMLAttributes tests', ()=> {
        it('should find no attributes', (done)=> {
            u.findHTMLAttributes('<div></div>').then((result)=>{
                expect(result._class).toEqual([]);
                expect(result._id).toEqual([]);
                done();
            },(err)=> {
                expect(err).not.toBeDefined();
            });
        });

        it('should find  classes for react', (done)=> {
            let className = "{isTrue ? 'show':'hide'}";
            u.findHTMLAttributes(`<div className="${className}"></div>`).then((result)=>{
                expect(result._class).toEqual(['show', 'hide']);
                expect(result._id).toEqual([]);
                done();
            },(err)=> {
                expect(err).not.toBeDefined();
            });
        });
    });
});