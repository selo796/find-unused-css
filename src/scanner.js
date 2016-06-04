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
      this._fileFinder.getFiles(this.conf.htmlDirectory, 'HTML', this.conf.excludes).then((htmlFiles) => {
        if (htmlFiles && htmlFiles.length > 0) {
          var cssSelectorsInHtmlFiles;
          var attributes;
          var attributePromises = [];
          var cssSelectorPromises = [];
          var listOfUnusedClasses = [];
          var listOfUnusedIds = [];
          for (let htmlFile of htmlFiles) {
            // Add all promises in an array inorder to use Promise.all
            attributePromises.push(this._attributeFinder.findAttribute(htmlFile));
          }

          for (let cssFile of this.conf.cssFiles) {
            // Add all promises in an array inorder to use Promise.all
            cssSelectorPromises.push(this._selectorFinder.run(cssFile));
          }

          Promise.all(cssSelectorPromises).then((cssSelectorList) => {
              Promise.all(attributePromises).then((value) => {
                attributes = value [0];
                var countUnusedIds = 0;
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
                resolve(result);

              }, (reason) => {
                spinner.stop();
                resolve(result);

              });
            }, (reason) => {
              spinner.stop();

              resolve('An error occurs while reading your css file. Please check:' +
              reason);
            });

        } else {
          spinner.stop();
          resolve('No html files found...');
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
