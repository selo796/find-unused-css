var htmlparser = require('htmlparser2');
var fs = require('fs');

class AttributeFinder {

    constructor() {
      this.attributes = {
        _class:[],
        _id:[],
      };
    }

    readHTMLFile (filePath) {
      return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
          if (err) {
            reject(err);
          }

          resolve(data);
        });
      });
    }

    findAttribute (filePath) {
      let parser;
      let _this = this;
      return new Promise(function (resolve, reject) {
        parser = new htmlparser.Parser({
          onattribute: function (name, value) {
            if (name === 'class') {
              for (let cssClass of value.split(' ')) {
                if (_this.attributes._class.indexOf(cssClass) === -1) {
                  _this.attributes._class.push(cssClass);
                }
              }
            }

            if (name === 'id') {
              if (_this.attributes._id.indexOf(value) === -1) {
                _this.attributes._id.push(value);
              }
            }
          },

          onend: function () {
            resolve(_this.attributes);
          },

          onerror: function (err) {
            reject(err);
          },

        }, {
          decodeEntities: true,
        });

        _this.readHTMLFile(filePath).then(function (html) {
          parser.write(html);
          parser.end();
        });
      });
    }
}

module.exports = AttributeFinder;
