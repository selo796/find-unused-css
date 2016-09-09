'use strict';

let Spinner = require('cli-spinner').Spinner;
let FileFinderModule = require('./modules/fileFinder');
let SelectorFinderModule = require('./css/selectorFinder');
let AttributeFinderModele = require('./html/attributeFinder');

let spinner = new Spinner('Analyzing .. %s');

class Scanner {

  constructor(configObj) {
    this.conf = configObj;
    this._fileFinder = new FileFinderModule();
    this._selectorFinder = new SelectorFinderModule();
    this._attributeFinder = new AttributeFinderModele();
  }

  _getAttributes(htmlFiles) {
    let attributePromises = [];
    for (let htmlFile of htmlFiles) {
      // Add all promises in an array inorder to use Promise.all
      attributePromises.push(this._attributeFinder.findAttribute(htmlFile));
    }
    return attributePromises;
  }

  _getCssSelectors(cssFiles) {
    let cssSelectorPromises = [];
    for (let cssFile of cssFiles) {
        // Add all promises in an array inorder to use Promise.all
        cssSelectorPromises.push(this._selectorFinder.run(cssFile));
    }
    return cssSelectorPromises; 
  }

  run() {
    let result = {};
    return new Promise((resolve, reject) => {
      try {
        this._checkConfig();
      } catch (e) {
        reject(e);
        return;
      }
      spinner.setSpinnerString('|/-\\');
      spinner.start();
      // find all html files
      let htmlFilePromises = this._fileFinder.getFiles(this.conf.htmlDirectory, 'HTML',  this.conf.excludes);
      htmlFilePromises.then((htmlFiles) => {
        if (htmlFiles && htmlFiles.length > 0) {
          let attributes;
          let cssSelectorPromises = [];
          let listOfUnusedClasses = [];
          let listOfUnusedIds = [];
          
          this._fileFinder.getFiles(this.conf.cssFiles, 'CSS').then((cssFiles) => {
              Promise.all(this._getCssSelectors(cssFiles)).then((cssSelectorList) => {
                Promise.all(this._getAttributes(htmlFiles)).then((value) => {
                  attributes = value [0];
                  let countUnusedIds = 0;
                  this._selectorFinder.selectors._class.forEach(function(_class) {
                    /* istanbul ignore else */
                    if (attributes._class.indexOf(_class) === -1) {
                      listOfUnusedClasses.push(_class);
                    }
                  });

                  this._selectorFinder.selectors._id.forEach(function(_id) {
                    /* istanbul ignore else */
                    if (attributes._id.indexOf(_id) === -1) {
                      listOfUnusedIds.push(_id);
                      countUnusedIds++;
                    }
                  });

                  spinner.stop();

                  resolve({
                    totalNumberOfHtmlFiles: htmlFiles.length,
                    totalNumberOfClassSelectors: this._selectorFinder.selectors._class.length,
                    totalNumberOfIdSelectors: this._selectorFinder.selectors._id.length,
                    numberOfUnusedIds: countUnusedIds,
                    unusedClasses: listOfUnusedClasses,
                    unusedIds: listOfUnusedIds,
                  });
                }, (reason) => {
                  spinner.stop();
                  resolve(result);
                });
            }, (reason) => {
              spinner.stop();
              resolve('An error occurs while reading your css file. Please check:' + reason);
            });
          },(err) => {
              spinner.stop();
              reject(err);
          });
        }
      }, (err) => {
        spinner.stop();
        reject(err);
      });

    });
  }

  _checkConfig() {
    if (!this.conf) {
      throw 'Config file is not found.';
    } else if (!this.conf.htmlDirectory) {
      throw 'Please check your config file. No htmlDirectory is defined.';
    } else if (!this.conf.cssFiles) {
      throw 'Please check your config file. No cssFiles is defined.';
    }
    return true;
  }
}

module.exports = Scanner;
