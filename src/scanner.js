'use strict';

let Spinner = require('cli-spinner').Spinner;
let chalk = require('chalk');
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
    this._checkConfig();
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    let result = {};
    return new Promise((resolve, reject) => {
      this._fileFinder.getFiles(this.conf.htmlDirectory, 'HTML').then((htmlFiles) => {
        if (htmlFiles && htmlFiles.length > 0) {
          var cssSelectorsInHtmlFiles;
          var attributes;
          var attributePromises = [];
          var cssSelectorPromises = [];

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
                var countUnusedClasses = 0;
                var countUnusedIds = 0;
                this._selectorFinder.selectors._class.forEach(function(_class) {
                  /* istanbul ignore else */
                  if (attributes._class.indexOf(_class) === -1) {
                    console.log(
                      'Class "' + chalk.bgYellow.bold(_class) + '" not used');
                    countUnusedClasses++;
                  }
                });

                this._selectorFinder.selectors._id.forEach(function(_id) {
                  /* istanbul ignore else */
                  if (attributes._id.indexOf(_id) === -1) {
                    console.log('Id "' + chalk.bgYellow.bold(_id) + '" not used');
                    countUnusedIds++;
                  }
                });
                this._printIt('Number of scanned html files: ' + htmlFiles.length);

                this._printIt('Number of all css classes: ' +
                  this._selectorFinder.selectors._class.length);
                this._printIt('Number of unused css classes: ' +
                  countUnusedClasses);

                this._printIt('Number of all id selectors: ' +
                  this._selectorFinder.selectors._id.length);
                this._printIt('Number of unused id selectors: ' + countUnusedIds);
                spinner.stop();

                resolve({
                  totalNumberOfHtmlFiles: htmlFiles.length,
                  totalNumberOfClassSelectors: this._selectorFinder.selectors._class.length,
                  numberOfUnusedCssClasses: countUnusedClasses,
                  totalNumberOfIdSelectors: this._selectorFinder.selectors._id.length,
                  numberOfUnusedIds: countUnusedIds,
                });
                resolve(result);

              }, (reason) => {
                spinner.stop();
                resolve(result);

              });
            }, (reason) => {
              spinner.stop();
              this._printIt(
                'An error occurs while reading your css file. Please check:' +
                reason);
              resolve(result);
            });

        } else {
          this._printIt('No html files found...');
          spinner.stop();
          resolve(result);
        }
      }, (err) => {
        spinner.stop();

        this._printIt(err);
        reject(err);
      });

    });
  }

  _checkConfig() {
    if (!this.conf) {
      throw new Error('Config file is not found.');
    } else if (!this.conf.htmlDirectory) {
      throw new Error('Please check your config file. No htmlDirectory is defined.');
    } else if (!this.conf.cssFiles) {
      throw new Error('Please check your config file. No cssFiles is defined.');
    }
    return true;
  }

  _printIt(output) {
    /* istanbul ignore next */
    console.log(chalk.bgBlack(chalk.yellow(output)));
  }
}

module.exports = Scanner;
