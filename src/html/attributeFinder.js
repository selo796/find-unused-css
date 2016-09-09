'use strict';

let Util = require('../modules/util');

class AttributeFinder {

  constructor() {
    this.attributes = {
      _class: [],
      _id: [],
    };
    this._util = new Util();
  }

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
