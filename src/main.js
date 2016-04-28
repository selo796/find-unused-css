require('babel-core/register');

var FileFinderModule = require('./modules/fileFinder'),
SelectorFinderModule = require('./css/selectorFinder'),
AttributeFinderModele = require('./html/attributeFinder'),
LineByLineReader = require('line-by-line'),
chalk = require('chalk'),
readline = require('readline');

var FileFinder = new FileFinderModule(),
SelectorFinder = new SelectorFinderModule(),
AttributeFinder = new AttributeFinderModele();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var cssPath;
var htmlDirectory;
rl.question('Path of your css file? ', (cssPath) => {
  rl.question('Path of your html directory? ', (htmlDirectory) => {
    run(cssPath, htmlDirectory);
  });
});

function run(cssPath, htmlDirectory) {
  var promise = FileFinder.getFiles(htmlDirectory, 'HTML');
  promise.then((result) => {
    if (result) {
      var cssSelectorsInHtmlFiles;
      var attributes;
      var attributePromises = [];
      for (htmlFile of result) {
        // add all promises in an array inorder to use Promise.all
        attributePromises.push(AttributeFinder.findAttribute(htmlFile));
      }

      var lr = new LineByLineReader(cssPath, { encoding: 'utf8', skipEmptyLines: false });

      lr.on('error', onLineError);

      lr.on('line', (line) => {
        SelectorFinder.findCssSelectors(line);
      });

      lr.on('end', function () {
        Promise.all(attributePromises).then(function (value) {
          attributes = value [0];
          var countUnusedClasses = 0;
          var countUnusedIds = 0;
          SelectorFinder.selectors._class.forEach(function (_class) {
            if (attributes._class.indexOf(_class) === -1) {
              console.log('Class "' + chalk.bgYellow.bold(_class) + '" not used');
              countUnusedClasses++;
            }
          });

          SelectorFinder.selectors._id.forEach(function (_id) {
            if (attributes._id.indexOf(_id) === -1) {
              console.log('Id "' + chalk.bgYellow.bold(_id) + '" not used');
              countUnusedIds++;
            }
          });

          console.log('Number of all css classes: ',
            chalk.bgGreen.bold(SelectorFinder.selectors._class.length));
          console.log('Number of unused css classes: ', chalk.bgGreen.bold(countUnusedClasses));

          console.log('Number of all id selectors: ',
            chalk.bgGreen.bold(SelectorFinder.selectors._id.length));
          console.log('Number of unused id selectors: ', chalk.bgGreen.bold(countUnusedIds));

        }, function (reason) {

          throw new Error(reason);
        });
      });

    } else {
      console.log('No files found...');
    }

    rl.close();

  }, (err) => {
    rl.close();
    console.log(err);
    throw new Error(err);
  });
}


function onLineError(err) {
  console.log('An error occurs while reading your css. Please check:', err);
  rl.close();
}
