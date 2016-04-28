export class SelectorFinder {

  constructor() {
    this.selectors = {
      _id: [],
      _class: [],
    };

    this.isCommentStarted = false;
    this.isCommentEnded = false;
    this.lineCounter = 0;
  }

  findClasses (text) {
    const classRegex = /(\.[^ ):]+)/g;
    const splitter = '.';
    const selector = '_class';

    if (classRegex.test(text)) {
      text = text.match(classRegex);

      var currentClass;

      // needs to be refactored
      text.forEach((classs)=> {
        currentClass = classs.match(/(\.[^ ):]+)/)[0];
        currentClass = currentClass.split('.');
        currentClass.forEach((c)=> {
          if (c && this.isCssSelectorValid(c)) {
            c = this.filterSelector(c);
            this.pushIntoSelectors(c, selector);
          }
        });

      });
    }

    return this.selectors;

  }

  findIdSelectors (text) {
    const idRegex = /(\#[^ ):]+)/g;
    const splitter = '#';
    const selector = '_id';
    if (idRegex.test(text)) {
      text = text.match(idRegex);

      var currentClass;
      text.forEach((_id) => {
        currentClass = _id.match(/(\#[^ .):]+)/)[0];
        currentClass = currentClass.split(splitter);

        currentClass.forEach((c) => {
          if (c && this.isCssSelectorValid(c)) {
            c = this.filterSelector(c);
            this.pushIntoSelectors(c, selector);
          }
        });
      });
    }

    return this.selectors;
  }

  findCssSelectors(text) {
    this.lineCounter++;
    text = text.trim();

    if (text.startsWith('src:') ||
      text.startsWith('@') ||
      text.indexOf('"') > -1 ||
      this.isInComment(text)
    ) {
      return this.selectors;
    }

    this.findClasses(text);
    this.findIdSelectors(text);

    return this.selectors;
  }

  isInComment (text) {
    if (text.indexOf('/*') > -1) {
      this.isCommentStarted = true;
      this.isCommentEnded = false;
      return true;
    }

    if (this.isCommentStarted && text.indexOf('*/') > -1) {
      this.isCommentEnded = true;
      this.isCommentStarted = false;
    }

    return this.isCommentStarted;
  }

  pushIntoSelectors (text, selector) {
    if (!(this.selectors[selector].indexOf(text) > -1)) {
      this.selectors[selector].push(text);
    }
  }

  isColor (text) {
    const colorRegex = /#[0-9a-f]{6}|#[0-9a-f]{3}/ig;
    return colorRegex.test(text);
  }

  isCssSelectorValid (selector) {
    return /^\D.*$/.test(selector) &&
      selector.indexOf('*') === -1 &&
      selector.indexOf(';') === -1 &&
      !this.isColor('#' + selector);
  }

  removeComma (text) {
    if (text.indexOf(',') > -1) {
      return text.substring(0, text.indexOf(','));
    }

    return text;
  }

  filterSelector (selector) {
    return this.removeComma(selector);
  }

}
module.exports = SelectorFinder;
