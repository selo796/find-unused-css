
var readline = require('readline');
var Scanner = require('./scanner');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Path of your css file? ', (cssPath) => {
  rl.question('Path of your html directory? ', (htmlDirectory) => {
    var confObj = {
      'htmlDirectory': htmlDirectory,
      'cssPath': cssPath
    };
    new Scanner(confObj).run();
    rl.close();
  });
});
