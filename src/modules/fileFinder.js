'use strict';

var path = require('path');
var glob = require('glob');

class FileFinder {

  constructor() {
    this.fileExtensionObj = {
      JS: /\.js$/,
      HTML: /\.html$/,
      CSS: /\.css$/,
    };
  }

  _filterDirs (files, extensionList, ignoredDirs) {
    let result = [];
    let isNotIgnored = true;
    let toBeAnalyzed = true;
    return new Promise((resolve, reject) => {
      for (let file of files) {

        toBeAnalyzed = false;
        for (let extension of extensionList) {
            toBeAnalyzed = toBeAnalyzed || extension.test(file);
            if (toBeAnalyzed) {
              break;
            }
        }


        if(!toBeAnalyzed){
          continue;
        }

        isNotIgnored = true;
        if(ignoredDirs) {
            for (let ignoredDir of ignoredDirs) {
            ignoredDir = path.normalize(ignoredDir);
            isNotIgnored =
              isNotIgnored && path.dirname(file).indexOf(ignoredDir) === -1;
          }
        }
        /* istanbul ignore next */
        if (isNotIgnored) {
          result.push(file);
        }
      }
      resolve(result);
    });

  }

  getFiles(__glob, fileExtension, ignoredDirs) {
    let resultPromiseList = [];
    // find all css files from glob
    for (let glob of __glob) {
      resultPromiseList.push(this._getFilesFromGlob(glob, fileExtension, ignoredDirs));
    }
    return Promise.all(resultPromiseList).then((multipDimensionalArray)=> {
      let result = [];
      for (let files of multipDimensionalArray) {
        for (let file of files) {
          // Add all promises in an array inorder to use Promise.all
          result.push(file);
        }
      }
      return result;
    },(err)=> {
      return new Promise((resolve, reject) => {
        reject('Looking for file extension:'+ fileExtension+', but no files found in: "' +  __glob + '"');
      });
    });
  }

  _getFilesFromGlob(__glob, fileExtensionList, ignoredDirs) {
    let extensionList = this._getRegexForFileExtension(fileExtensionList);
    return new Promise((resolve, reject) => {
      glob(__glob, {nonull:false},  (err, matches) => {
        if (err) {
          reject('An error occurs while searching for files in ' + __glob, err);
        }
        this._filterDirs(matches, extensionList, ignoredDirs).then((result)=> {
            if(result.length === 0 || (__glob && matches[0] === __glob && result===__glob)) {
              reject('Looking for file extension:'+ fileExtensionList+', but no files found in: "' +  __glob + '"');
            }
            resolve(result);
          }, (err)=> {
            reject('An error occurs while searching for files in ' + __glob, err);
          });
      });
    });
  }

  _getRegexForFileExtension(extensionList) {

    var result = [];
    for(let extension of extensionList) {
      result.push(this.fileExtensionObj[extension]);
    }

    if (result) {
      return result;
    }

    throw Error('File extension could not be found...');
  }
}

module.exports = FileFinder;
