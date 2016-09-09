'use strict';
var fs = require('fs');
let htmlparser = require('htmlparser2');

class Util {
    constructor() {
        this.attributes = {
            _class: [],
            _id: [],
        };
    }
    readFile(filePath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    findHTMLAttributes(html) {
        let parser;
        let _this = this;
        const bracketRegex = /\{([^)]+)\}/g;
        
        return new Promise((resolve, reject) => {
            parser = new htmlparser.Parser({
                onattribute: function (name, value) {
                    if (name === 'class' || name === 'classname') {
                        if (bracketRegex.test(value)) {
                            let classesWithoutBraket = value.split('{')[0].trim();
                            let classesWithBraket = value.split('{')[1].trim();
                            let classesWithoutQuery = classesWithBraket.split('?')[1];
                            classesWithoutQuery = classesWithoutQuery.substring(0, classesWithoutQuery.indexOf('}'));
                            value = classesWithoutBraket;
                            for(let _clazz of classesWithoutQuery.split(':')){
                                _clazz = _clazz.replace(/'/g, '').trim();
                                value +=' ' + _clazz; 
                            }
                        }
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

            parser.write(html);
            parser.end();
        });

    }

}

module.exports = Util;