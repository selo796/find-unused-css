
var readline = require('readline');
var CommanLineReader = require('./config/commanLineReader');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Path of your css file? ', (cssPath) => {
  rl.question('Path of your html directory? ', (htmlDirectory) => {
    new CommanLineReader(cssPath, htmlDirectory).run();
    rl.close();
  });
});
