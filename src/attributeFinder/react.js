'use strict';

let Strategy = require('./strategy').AbstractAttributeFinder;
const returnRegex = /return.\(([^)]+)\)/g;
const parenthesesRegex = /\(([^)]+)\)/g;

class ReactAttributeFinder extends Strategy {

  findAttribute(reactFile) {
    return new Promise((resolve, reject) => {
      this._util.readFile(reactFile).then((file) => {
        if (returnRegex.test(file)) {
          let returnStr = (file.match(returnRegex))[0];
          // html-snippet in renderer function
          let html = (returnStr.match(parenthesesRegex))[0];
          if (html) {
            this._util.findHTMLAttributes(html).then((result)=>{
              this.attributes = result;
              resolve(this.attributes);
            },(err)=>{
              reject(err);
            });
          } else {
            resolve(this.attributes);
          }
        } else {
          resolve(this.attributes);
        }
      }, (err) => {
        reject(err);
      });
    });
  }

}
module.exports = ReactAttributeFinder;
