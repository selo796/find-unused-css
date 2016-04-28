# find-unused-css

>A npm tool to find unused css selectors in your project.


## Getting Started


Install this package from npm:

```
npm install find-unused-css -g
```

Once the module has been installed, you can run it with this command globally:

```
find-unused-css
```

After running this command you will get two questions from command line

  1. **Path of your css file:**

  Enter a target css file e.g `dist/css/main.css`

  2. **Path of your html directory**  
  Enter a path of html directory which you would like to scan for used css selectors e.g `dist/html`.

Once you answer these two questions, your css selectors are scanned for given directory.

**Currently supported css selectors are `class (.class)` and `id (#id)` selectors.**

## Development

To start run `npm start`  and

For unit testing just run `npm test`

## Issues
Issues can be reported on the [issue tracker](https://github.com/selo796/find-unused-css/issues).


## What is next?

 - Improving the output instead of command line
 - Reading configuration from a json file instead of command line with
    - Support for multiple css files
    - Ignore HTML files
 - Support for attribute selectors
 - Support for AngularJS

I am very happy for ever feedback...
