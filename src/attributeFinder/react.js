'use strict';

let Strategy = require('./strategy').AbstractAttributeFinder;
const returnRegex = /return.\(([^)]+)\)/g;
const parenthesesRegex = /\(([^)]+)\)/g;

class ReactAttributeFinder extends Strategy {

  findAttribute(reactFile) {
    return new Promise((resolve, reject) => {
      this._util.readFile(reactFile).then((file) => {
        if (returnRegex.test(file)) {
          let resultPromiseList = [];
          let returnStrList = (file.match(returnRegex));
          for (let returnStr of returnStrList) {
            // html-snippet in renderer function
            let html = (returnStr.match(parenthesesRegex))[0];
            if (html) {
              resultPromiseList.push(this._util.findHTMLAttributes(html));
            }
          }

          if (resultPromiseList.length > 0) {
            Promise.all(resultPromiseList).then((resultList) => {
              for (let attr of resultList) {
                this.attributes._class = (this.attributes._class).concat(attr._class.filter((item) => {
                  return this.attributes._class.indexOf(item) < 0;
                }));
                this.attributes._id = (this.attributes._id).concat(attr._id.filter((item) => {
                  return this.attributes._id.indexOf(item) < 0;
                }));
              }
              resolve(this.attributes);
            }, (err) => {
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
