'use strict';
let Util = require('../modules/util');

// Abstract class
class Strategy {
    constructor() {
        this.attributes = {
            _class: [],
            _id: [],
        };
        this._util = new Util();
    }

    findAttribute(filePath) {
        throw new Error("Abstract method!");
    }
}


class AttributeFinder {
    constructor(strategy) {
        this.strategy = strategy;
    }

    execute(filePath) {
        return this.strategy.findAttribute(filePath);
    }

}

module.exports = {
    attributeFinder: AttributeFinder,
    AbstractAttributeFinder: Strategy
};

