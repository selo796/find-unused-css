'use strict';

let Strategy = require('./strategy').AbstractAttributeFinder;
const classRegex = /addClass.?\(.?[^ +function]([^)]+)\)/g;
const appendRegex = /append.?\(.?[^ +function]([^)]+)\)/g;
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
      if(_clazz && this.attributes._class.indexOf(_clazz) === -1) {
            this.attributes._class.push(_clazz);
      }
    }
  }
  findAttribute(reactFile) {
    return new Promise((resolve, reject) => {
      this._util.readFile(reactFile).then((file) => {
        let resultPromiseList = [];
        if (classRegex.test(file)) {
          let addClassStrList = (file.match(classRegex));
          for (let returnStr of addClassStrList) {
            let classText = (returnStr.match(parenthesesRegex))[0];
            /* istanbul ignore else */
            if (classText) {
              this.setClassAttr(classText);
            }
          }

        }

        if (appendRegex.test(file)) {
          let htmlList = (file.match(appendRegex));
          for (let html of htmlList) {
            let classText = (html.match(parenthesesRegex))[0];

            if (html) {
               resultPromiseList.push(this._util.findHTMLAttributes(html));
            }
          }

        }

        if(resultPromiseList.length>0) {
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
      }, (err) => {
        reject(err);
      });
    });
  }

}
module.exports = jQueryAttributeFinder;
