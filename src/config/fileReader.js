'use strict';

let fs = require('fs');
const pathToConfigFile = './findUnusedCss.json';

class FileReader {

  constructor(configFile) {
    this._configObj = {};
    this.configFile = configFile || pathToConfigFile;
  }

  getConfig() {
    if (this.isConfigExists()) {
      this._configObj = fs.readFileSync(this.configFile, 'utf8');

      try {
        this._configObj = JSON.parse(this._configObj);
      } catch (e) {
        throw new Error('An error occurs while parsing the config file.');
      }

    } else {
      throw new Error('Config file is not found.');
    }

    return this._configObj;
  }

  isConfigExists() {
    return fs.existsSync(this.configFile);
  }

}

module.exports = FileReader;
