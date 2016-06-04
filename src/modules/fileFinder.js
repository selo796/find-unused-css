'use strict';

var find = require('find');
var path = require('path');

class FileFinder {

  constructor() {
    this.fileExtensionObj = {
      JS: /\.js$/,
      HTML: /\.html$/,
      CSS: /\.css$/,
    };
  }

  _filterDirs (files, ignoredDirs) {
    let result = [];
    let isNotIgnored = true;
    return new Promise((resolve, reject) => {
      if (ignoredDirs && ignoredDirs.length > 0) {
        for (let file of files) {
          isNotIgnored = true;
          for (let ignoredDir of ignoredDirs) {
            ignoredDir = path.normalize(ignoredDir);
            isNotIgnored =
              isNotIgnored && path.dirname(file).indexOf(ignoredDir) === -1;
          }
          /* istanbul ignore next */
          if (isNotIgnored) {
            result.push(file);
          }
        }
        resolve(result);
      } else {
        resolve(files);
      }

    });

  }


  getFiles(__dirname, fileExtension, ignoredDirs) {
    let extension = this._getRegexForFileExtension(fileExtension);
    return new Promise((resolve, reject) => {
      find.file(extension, __dirname, (files) => {
        this._filterDirs(files, ignoredDirs).then((result)=> {
            resolve(result);
          });
      })
      .error(function(err) {
        if (err) {
          reject('Directory: "' +  __dirname + '" not found!', err);
        }
      });
    });
  }

  _getRegexForFileExtension(fileExtension) {
    var result =  this.fileExtensionObj[fileExtension];

    if (result) {
      return result;
    }

    throw Error('File extension could not be found...');
  }

}

module.exports = FileFinder;
