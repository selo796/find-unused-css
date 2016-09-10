'use strict';
let Strategy = require('./strategy').AbstractAttributeFinder;

class AttributeFinder extends Strategy {

  findAttribute(filePath) {
    return new Promise((resolve, reject) => {
      this._util.readFile(filePath).then((html) => {
        this._util.findHTMLAttributes(html).then((result) => {
          this.attributes = result;
          resolve(this.attributes);
        }, (err) => {
          reject(err);
        });
      });
    });
  }
}

module.exports = AttributeFinder;
