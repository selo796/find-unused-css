'use strict';

let Strategy = require('./strategy').AbstractAttributeFinder;
const classRegex = /addClass.?\(.?[^ +function]([^)]+)\)/g;
const parenthesesRegex = /\(([^)]+)\)/g;

class jQueryAttributeFinder extends Strategy {

  setClassAttr(classText) {
    let classList = [];
    classText = classText.replace(/'/g, '');
    classText = classText.replace(/"/g, '');
    classText = classText.replace("(", '');
    classText = classText.replace(")", '');
    classText = classText.trim();
    classText = classText.replace(/(?:\r\n|\r|\n)/g, ''); // replace all line breaks
    classText = classText.replace(/\s\s+/g, ' '); // replace multiple empty chars with
    classList = classText.split(' ');
    for (let _clazz of classList) {
      if(_clazz) {
        this.attributes._class.push(_clazz);
      }
    }
  }
  findAttribute(reactFile) {
    return new Promise((resolve, reject) => {
      this._util.readFile(reactFile).then((file) => {
        if (classRegex.test(file)) {
          let addClassStrList = (file.match(classRegex));
          for (let returnStr of addClassStrList) {
            let classText = (returnStr.match(parenthesesRegex))[0];
            /* istanbul ignore else */
            if (classText) {
              this.setClassAttr(classText);
            }
          }
          resolve(this.attributes);
        } else {
          resolve(this.attributes);
        }

      }, (err) => {
        reject(err);
      });
    });
  }

}
module.exports = jQueryAttributeFinder;
