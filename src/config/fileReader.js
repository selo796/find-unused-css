'use strict';

let fs = require('fs');
const pathToConfigFile = './findUnusedCss.json';

class FileReader {

  constructor() {
    this._configObj = {};
  }

  getConfig(configFile) {
    let config = configFile || pathToConfigFile;
    try {
      this._configObj = fs.readFileSync(config, 'utf8');
    } catch (e) {
      throw new Error('Config file is not found.');
    }

    try {
      this._configObj = JSON.parse(this._configObj);
    } catch (e) {
      throw new Error('An error occurs while parsing the config file.');
    }
    return this._configObj;
  }

}

module.exports = FileReader;
