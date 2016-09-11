/* global process */
'use strict';
var readline = require('readline');
var ConfigFileReader = require('./config/fileReader');
var Scanner = require('./scanner');
var fileReader = new ConfigFileReader();
var CommandLineReporterModule = require('./reports/commandLineReport');

if (fileReader.isConfigExists()) {
  report(fileReader.getConfig());
} else {
  readConfigFromCommandLine();
}

function readConfigFromCommandLine() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Path of your css file? ', (cssPath) => {
    rl.question('Path of your source code directory? ', (directory) => {
      rl.question('Enable Html file analzing? ', (analyzeHtml) => {
        rl.question('Enable React analzing?', (analyzeReact) => {
          var confObj = {
            source_files: [directory],
            cssFiles: [cssPath],
            options: {
              htmlAnalyzing: analyzeHtml === '1' ? true : false,
              reactAnalyzing: analyzeReact === '1' ? true : false
            }
          };
          report(confObj);
          rl.close();
        });
      });
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
