'use strict';

class SelectorFilter {

  constructor () {
    this.specialChars = [',', '{'];
  }

  _removeSpecialChars (text) {
    for (let char of this.specialChars) {
      if (text.indexOf(char) > -1) {
        text = text.substring(0, text.indexOf(char));
      }
    }

    return text;
  }

  filterSelector (selector) {
    return this._removeSpecialChars(selector);
  }

}

module.exports = SelectorFilter;
