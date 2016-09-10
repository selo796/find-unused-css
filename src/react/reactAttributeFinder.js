'use strict';

let Util = require('../modules/util');
const returnRegex = /return.\(([^)]+)\)/g;
const parenthesesRegex = /\(([^)]+)\)/g;

class ReactAttributeFinder {

  constructor() {
    this.attributes = {
      _class: [],
      _id: [],
    };
    this._util = new Util();
  }

  run(reactFile) {
    return new Promise((resolve, reject) => {
      this._util.readFile(reactFile).then((file) => {
        if (returnRegex.test(file)) {
          let returnStr = (file.match(returnRegex))[0];
          let html = (returnStr.match(parenthesesRegex))[0];
          if (html) {
            this._util.findHTMLAttributes(html).then((result)=>{
              this.attributes = result;
              resolve(this.attributes);
            },(err)=>{
              reject(err);
            });
          } else {
            reject('An error occurs while parsing '+ reactFile);
          }
        }
      }, (err) => {
        reject(err);
      });
    });
  }

}
module.exports = ReactAttributeFinder;
