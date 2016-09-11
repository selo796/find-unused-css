/* global console */
'use strict';
let chalk = require('chalk');

const util = require('util');

class CommandLineReporter {
  constructor(result) {
    this.result = result;
  }

  print() {
    if (util.isObject(this.result)) {
      let resultObj = this.result;

      for (let _class of resultObj.unusedClasses) {
        console.log(
          'Class "' + chalk.bgYellow.bold(_class) + '" not used');
      }

      for (let _id of resultObj.unusedIds) {
        console.log(
          'Id "' + chalk.bgYellow.bold(_id) + '" not used');
      }

      this._printItInColor('Number of scanned files: ' +
        resultObj.totalNumberOfScannedFiles);

      this._printItInColor('Number of all css classes: ' +
        resultObj.totalNumberOfClassSelectors);

      this._printItInColor('Number of unused css classes: ' +
        resultObj.unusedClasses.length);

      this._printItInColor('Number of all id selectors: ' +
        resultObj.totalNumberOfIdSelectors);

      this._printItInColor('Number of unused id selectors: ' +
        resultObj.unusedIds.length);

    } else {
      this._printItInColor(this.result);
    }
  }

  _printItInColor(output) {
    /* istanbul ignore next */
    console.log(chalk.bgBlack(chalk.yellow(output)));
  }
}

module.exports = CommandLineReporter;
