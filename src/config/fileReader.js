'use strict';

let fs = require('fs');

class FileReader {

    constructor(pathToConfigFile) {
      this._configObj = {};
    }

    readConfig(pathToConfigFile) {
      // Read the fityle and send to the callback
      fs.readFile(pathToConfigFile, (err, data) => {
        if (err) {
          throw err;
        };
        let config = JSON.parse(data);
      });
    }

    getConfig() {
      return this._configObj;
    }
}

module.exports = FileReader;
