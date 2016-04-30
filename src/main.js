var FileFinderModule = require('./modules/fileFinder');
var SelectorFinderModule = require('./css/selectorFinder');
var AttributeFinderModele = require('./html/attributeFinder');
var LineByLineReader = require('line-by-line');
var chalk = require('chalk');
var readline = require('readline');
var Spinner = require('cli-spinner').Spinner;

var FileFinder = new FileFinderModule();
var SelectorFinder = new SelectorFinderModule();
var AttributeFinder = new AttributeFinderModele();

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
  var spinner = new Spinner('Analyzing .. %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();
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

      var lr = new LineByLineReader(cssPath, {
        encoding: 'utf8', skipEmptyLines: false
      });

      lr.on('error', onLineError);

      lr.on('line', (line) => {
        SelectorFinder.find(line);
      });

      lr.on('end', () => {
        Promise.all(attributePromises).then(function(value) {
          attributes = value [0];
          var countUnusedClasses = 0;
          var countUnusedIds = 0;
          SelectorFinder.selectors._class.forEach(function(_class) {
            if (attributes._class.indexOf(_class) === -1) {
              console.log('Class "' + chalk.bgYellow.bold(_class) + '" not used');
              countUnusedClasses++;
            }
          });

          SelectorFinder.selectors._id.forEach(function(_id) {
            if (attributes._id.indexOf(_id) === -1) {
              console.log('Id "' + chalk.bgYellow.bold(_id) + '" not used');
              countUnusedIds++;
            }
          });

          console.log(chalk.bgBlack(chalk.yellow('Number of scanned html files: ' + result.length)));
          console.log(chalk.bgBlack(chalk.yellow('Number of all css classes: ',SelectorFinder.selectors._class.length)));
          console.log(chalk.bgBlack(chalk.yellow('Number of unused css classes: ', countUnusedClasses)));

          console.log(chalk.bgBlack(chalk.yellow('Number of all id selectors: ', SelectorFinder.selectors._id.length)));
          console.log(chalk.bgBlack(chalk.yellow('Number of unused id selectors: ', countUnusedIds)));

        }, (reason) => {
          rl.close();
          spinner.stop();

          throw new Error(reason);

        });
      });

    } else {
      console.log('No files found...');
    }

    rl.close();
    spinner.stop();

  }, (err) => {
    rl.close();
    spinner.stop();

    console.log(err);
    throw new Error(err);
  });
}

function onLineError(err) {
  console.log('An error occurs while reading your css file. Please check:', err);
  rl.close();
}
