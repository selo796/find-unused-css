'use strict';

let LineByLineReader = require('line-by-line');
let SelectorFilter = require('./selectorFilter');
let chalk = require('chalk');

class SelectorFinder {

  constructor() {
    this.selectors = {
      _id: [],
      _class: [],
    };

    this.isCommentStarted = false;
    this.isCommentEnded = false;
    this.lineCounter = 0;
    this.filter = new SelectorFilter();
  }

  _findClassSelectors(text) {
    const classRegex = /(\.[^ ):]+)/g;
    const splitter = '.';
    const selector = '_class';

    if (classRegex.test(text)) {
      text = text.match(classRegex);

      var currentClass;

      text.forEach((_class)=> {
        currentClass = _class.split(splitter);
        currentClass.forEach((c)=> {
          if (c && this.isCssSelectorValid(c)) {
            c = this.filter.filterSelector(c);
            this.pushIntoSelectors(c, selector);
          }
        });

      });
    }

    return this.selectors;

  }

  _findIdSelectors(text) {
    const idRegex = /(\#[^ .):]+)/g;
    const splitter = '#';
    const selector = '_id';
    if (idRegex.test(text)) {
      text = text.match(idRegex);

      var currentId;
      text.forEach((_id) => {
        currentId = _id.split(splitter);

        currentId.forEach((c) => {
          if (c && this.isCssSelectorValid('#' + c)) {
            c = this.filter.filterSelector(c);
            this.pushIntoSelectors(c, selector);
          }
        });
      });
    }

    return this.selectors;
  }

  find(text) {
    this.lineCounter++;
    text = text.trim();

    if (text.startsWith('src:') ||
      text.startsWith('@') ||
      text.indexOf('"') > -1 ||
      this.isInComment(text)
    ) {
      return this.selectors;
    }

    this._findClassSelectors(text);
    this._findIdSelectors(text);

    return this.selectors;
  }

  run(cssFile) {
    let lr = new LineByLineReader(cssFile, {
      encoding: 'utf8', skipEmptyLines: false,
    });

    return new Promise((resolve, reject) => {

      lr.on('line', (line) => {
        this.find(line);
      });

      lr.on('error', (err) => {
        reject(err);
      });

      lr.on('end', () => {
        resolve(cssFile + 'is finished');
      });
    });
  }

  isInComment(text) {
    if (text.indexOf('/*') > -1) {
      this.isCommentStarted = text.indexOf('*/') === -1 ? true : false;
      this.isCommentEnded = text.indexOf('*/') > -1 ? true : false;
      return true;
    }

    if (this.isCommentStarted && text.indexOf('*/') > -1) {
      this.isCommentEnded = true;
      this.isCommentStarted = false;
      return false;

    }

    return this.isCommentStarted;
  }

  pushIntoSelectors(text, selector) {
    if (!(this.selectors[selector].indexOf(text) > -1)) {
      this.selectors[selector].push(text);
    }
  }

  isColor(text) {
    const colorRegex = /#[0-9a-f]{6}|#[0-9a-f]{3}/ig;
    return colorRegex.test(text);
  }

  isCssSelectorValid(selector) {
    return /^\D.*$/.test(selector) &&
      selector.indexOf('*') === -1 &&
      selector.indexOf(';') === -1 &&
      !this.isColor(selector);
  }

}
module.exports = SelectorFinder;
