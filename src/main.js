var readline = require('readline');
var ConfigFileReader = require('./config/fileReader');
var Scanner = require('./scanner');
var fileReader = new ConfigFileReader();
var CommandLineReporterModule = require('./reports/commandLineReport');

if (fileReader.isConfigExists()) {
  var CommandLineReporter;
  report(fileReader.getConfig());

}else {
  readConfigFromCommandLine();
}

function readConfigFromCommandLine() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Path of your css file? ', (cssPath) => {
    rl.question('Path of your html directory? ', (htmlDirectory) => {
      var confObj = {
        htmlDirectory: htmlDirectory,
        cssFiles: [cssPath],
      };
      report(confObj);
      rl.close();
    });
  });
}

function report(confObj) {
  new Scanner(confObj).run().then((result) => {
    new CommandLineReporterModule(result).print();
  }, (err) => {
    new CommandLineReporterModule(err).print();
  });
}
