/* global require, describe, expect, it */
'use strict';

var FileReader = require('../../src/config/fileReader');

describe('Config File Reader Testing', ()=> {
  var s;

  it('should throw an error "Config file is not found"', ()=> {
    let configFile = './specs/config/testFiles/notFound.json';
    s =  new FileReader(configFile);

    expect(function() {s.getConfig();})
      .toThrow(new Error('Config file is not found.'));

  });

  it('should throw an error "Config file is not found"', ()=> {
    s =  new FileReader();
    expect(function() {s.getConfig();})
    .toThrow(new Error('Config file is not found.'));

  });

  it('should throw an error "An error occurs while parsing the config file."', ()=> {
    let configFile = './specs/config/testFiles/config-with-parse-error.json';
    s =  new FileReader(configFile);
    expect(function() {
      s.getConfig();
    }).toThrow(new Error('An error occurs while parsing the config file.'));

  });

  it('should return config obj', ()=> {
    s =  new FileReader('./specs/config/testFiles/config.json');
    expect(s.getConfig())
      .toEqual({test: [123]});

  });

});
