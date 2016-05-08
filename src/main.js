
var readline = require('readline');
var ScannerModule = require('./scanner');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Path of your css file? ', (cssPath) => {
  rl.question('Path of your html directory? ', (htmlDirectory) => {
    new ScannerModule(cssPath, htmlDirectory).run();
    rl.close();
  });
});
