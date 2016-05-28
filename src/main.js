
var readline = require('readline');
var ConfigFileReader = require('./config/fileReader');
var Scanner = require('./scanner');
var fileReader = new ConfigFileReader();

if (fileReader.isConfigExists()) {
  new Scanner(fileReader.getConfig()).run();
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
        'htmlDirectory': htmlDirectory,
        'cssFiles': [cssPath]
      };
      new Scanner(confObj).run();
      rl.close();
    });
  });
}
