'use strict';

let Spinner = require('cli-spinner').Spinner;
let chalk = require('chalk');
let LineByLineReader = require('line-by-line');
let FileFinderModule = require('../modules/fileFinder');
let SelectorFinderModule = require('../css/selectorFinder');
let AttributeFinderModele = require('../html/attributeFinder');

class CommanLineReader {

  constructor(cssPath, htmlDirectory) {
    this.cssPath = cssPath;
    this.htmlDirectory = htmlDirectory;

    this._fileFinder = new FileFinderModule();
    this._selectorFinder = new SelectorFinderModule();
    this._attributeFinder = new AttributeFinderModele();

  }

  run() {
    var spinner = new Spinner('Analyzing .. %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    var promise = this._fileFinder.getFiles(this.htmlDirectory, 'HTML');
    promise.then((result) => {
      if (result && result.length > 0) {
        var cssSelectorsInHtmlFiles;
        var attributes;
        var attributePromises = [];
        for (let htmlFile of result) {
          // add all promises in an array inorder to use Promise.all
          attributePromises.push(this._attributeFinder.findAttribute(htmlFile));
        }

        var lr = new LineByLineReader(this.cssPath, {
          encoding: 'utf8', skipEmptyLines: false
        });

        lr.on('error', this._onLineError);

        lr.on('line', (line) => {
          this._selectorFinder.find(line);
        });

        lr.on('end', () => {
          Promise.all(attributePromises).then((value) => {
            attributes = value [0];
            var countUnusedClasses = 0;
            var countUnusedIds = 0;
            this._selectorFinder.selectors._class.forEach(function(_class) {
              if (attributes._class.indexOf(_class) === -1) {
                console.log(
                  'Class "' + chalk.bgYellow.bold(_class) + '" not used');
                countUnusedClasses++;
              }
            });

            this._selectorFinder.selectors._id.forEach(function(_id) {
              if (attributes._id.indexOf(_id) === -1) {
                console.log('Id "' + chalk.bgYellow.bold(_id) + '" not used');
                countUnusedIds++;
              }
            });
            this._printIt('Number of scanned html files: ' + result.length);

            this._printIt('Number of all css classes: ' +
              this._selectorFinder.selectors._class.length);
            this._printIt('Number of unused css classes: ' +
              countUnusedClasses);

            this._printIt('Number of all id selectors: ' +
              this._selectorFinder.selectors._id.length);
            this._printIt('Number of unused id selectors: ' + countUnusedIds);

          }, (reason) => {
            spinner.stop();
            throw new Error(reason);

          });
        });

      } else {
        this._printIt('No html files found...');
      }

      spinner.stop();
    }, (err) => {
      spinner.stop();

      this._printIt(err);
      throw new Error(err);
    });
  }

  _onLineError(err) {
    console.log(chalk.bgBlack(chalk.yellow(
      'An error occurs while reading your css file. Please check:' , err)));
  }

  _printIt(output) {
    console.log(chalk.bgBlack(chalk.yellow(output)));
  }

}

module.exports = CommanLineReader;
