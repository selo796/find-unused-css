var find = require('find');

export class FileFinder {

    constructor() {
      this.fileExtensionObj = {
         JS:/\.js$/,
         HTML:/\.html$/,
         CSS:/\.css$/
      }
    }

    getFiles (__dirname, fileExtension) {
      let extension = this.getRegexForFileExtension(fileExtension);
      return new Promise(function (resolve, reject) {
        find.file(extension, __dirname, function(files) {
          resolve(files);
        })
        .error(function(err) {
          if (err) {
            reject('Directory: "'+ __dirname + '" not found!', err);
          }
        });
      });
    }

    getRegexForFileExtension (fileExtension) {
      var result =  this.fileExtensionObj[fileExtension];

      if (result) {
        return result;
      }

      throw Error('File extension could be found...');
    }

}
