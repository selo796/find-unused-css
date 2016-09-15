'use strict';

let Spinner = require('cli-spinner').Spinner;
let FileFinderModule = require('./modules/fileFinder');
let SelectorFinderModule = require('./css/selectorFinder');
let AttributeFinder = require('./attributeFinder/strategy').attributeFinder;
let HTMLAttributeFinder = require('./attributeFinder/html');
let ReactAttributeFinderModele = require('./attributeFinder/react');
let JQueryAttributeFinderModele = require('./attributeFinder/jquery');

let spinner = new Spinner('Analyzing .. %s');

class Scanner {

  constructor(configObj) {
    this.conf = configObj;
    this._fileFinder = new FileFinderModule();
    this._selectorFinder = new SelectorFinderModule();
    this._attributeFinderHTML = new AttributeFinder(new HTMLAttributeFinder());
    this._attributeFinderReact = new AttributeFinder(new ReactAttributeFinderModele());
    this._attributeFinderJQuery = new AttributeFinder(new JQueryAttributeFinderModele());
  }

  _getAttributes(files) {
    let attributePromises = [];
    for (let file of files) {
      if (this.conf.options.htmlAnalyzing && /\.html$/.test(file)) {
        // Add all promises in an array inorder to use Promise.all
        attributePromises.push(this._attributeFinderHTML.execute(file));
      }
      /* istanbul ignore else */
      else if (/\.js$/.test(file)) {
        // Add all promises in an array inorder to use Promise.all
        if (this.conf.options.reactAnalyzing) {
          attributePromises.push(this._attributeFinderReact.execute(file));
        } else if (this.conf.options.jQueryAnalyzing) {
          attributePromises.push(this._attributeFinderJQuery.execute(file));
        }
      }
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
      let fileExtensions = [];
      if (this.conf.options.htmlAnalyzing) {
        fileExtensions.push('HTML');
      }
      if (this.conf.options.reactAnalyzing ||  this.conf.options.jQueryAnalyzing) {
        fileExtensions.push('JS');
      }

      let sourceFiles = this._fileFinder.getFiles(this.conf.source_files, fileExtensions, this.conf.excludes);
      sourceFiles.then((files) => {
        if (files && files.length > 0) {
          let attributes = {
            _class: [],
            _id: []
          };
          let cssSelectorPromises = [];
          let listOfUnusedClasses = [];
          let listOfUnusedIds = [];

          this._fileFinder.getFiles(this.conf.cssFiles, ['CSS']).then((cssFiles) => {
            Promise.all(this._getCssSelectors(cssFiles)).then((cssSelectorList) => {
              // find all class selectors in html files
              Promise.all(this._getAttributes(files)).then((attributeObjList) => {

                for (let attr of attributeObjList) {
                  attributes._class = (attributes._class).concat(attr._class.filter((item) => {
                    return attributes._class.indexOf(item) < 0;
                  }));
                  attributes._id = (attributes._id).concat(attr._id.filter((item) => {
                    return attributes._id.indexOf(item) < 0;
                  }));
                }

                let countUnusedIds = 0;
                this._selectorFinder.selectors._class.forEach(function (_class) {
                  /* istanbul ignore else */
                  if (attributes._class.indexOf(_class) === -1) {
                    listOfUnusedClasses.push(_class);
                  }
                });

                this._selectorFinder.selectors._id.forEach(function (_id) {
                  /* istanbul ignore else */
                  if (attributes._id.indexOf(_id) === -1) {
                    listOfUnusedIds.push(_id);
                    countUnusedIds++;
                  }
                });

                spinner.stop();

                resolve({
                  totalNumberOfScannedFiles: files.length,
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
          }, (err) => {
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
    } else if (!this.conf.source_files) {
      throw 'Please check your config file. No source_files is defined.';
    } else if (!this.conf.cssFiles) {
      throw 'Please check your config file. No cssFiles is defined.';
    }
    this.conf.options = (this.conf.options || {});
    this.conf.options.htmlAnalyzing = this.conf.options.htmlAnalyzing === false ? false : true;
    this.conf.options.reactAnalyzing = this.conf.options.reactAnalyzing ? this.conf.options.reactAnalyzing : false;
    this.conf.options.jQueryAnalyzing = this.conf.options.jQueryAnalyzing ? this.conf.options.jQueryAnalyzing : false;

    return true;
  }
}

module.exports = Scanner;
