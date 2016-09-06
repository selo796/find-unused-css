# find-unused-css
[![Build Status](https://travis-ci.org/selo796/find-unused-css.svg?branch=master)](https://travis-ci.org/selo796/find-unused-css) [![Coverage Status](https://coveralls.io/repos/github/selo796/find-unused-css/badge.svg?branch=master)](https://coveralls.io/github/selo796/find-unused-css?branch=master)
[![NPM version](https://img.shields.io/npm/v/find-unused-css.svg?)](https://www.npmjs.com/package/find-unused-css)
[![Node](https://img.shields.io/node/v/find-unused-css.svg?)](https://www.npmjs.com/package/find-unused-css)

>A npm tool to find unused css selectors in your project.


## Installation

```shell
npm install find-unused-css -g
```

## Usage

Once the module has been installed, you can run it with this command globally:

```shell
find-unused-css
```

### From config file:
Create a config file namely "*findUnusedCss.json*" with following options:

```js
{
   // paths of css files for analyzing
  "cssFiles": ["./dist/css/*.css"],
  // path of html directory for analyzing
  "htmlDirectory": "./dist/**/*.html",
  // list of html folders, which are excluded during analyzing
  "excludes": ["./node_modules"],
}
```

### From the command line:

After running *find-unused-css* you will get two questions from command line

  1. **Path of your css file:**

  Enter a target css file e.g `dist/css/main.css`

  2. **Path of your html directory**  
  Enter a path of html directory which you would like to scan for unused css selectors e.g `dist/html`.

Once you answered these two questions, your css selectors are scanned for given directory.

**Currently supported css selectors are `class (.class)` and `id (#id)` selectors.**

## Development

To start run `npm start`  and

For unit testing just run `npm test`

## Issues
Issues can be reported on the [issue tracker](https://github.com/selo796/find-unused-css/issues).


## What is next?

 - Improving the output instead of command line
 - Read config file from command line
 - Support for attribute selectors
 - Support for AngularJS

I am very happy for every feedback...
