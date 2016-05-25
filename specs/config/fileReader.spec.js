/* global require, describe, expect, it */
'use strict';

var FileReader = require('../../src/config/fileReader');

describe('Config File Reader Testing', ()=> {
  var s;
  beforeEach(()=> {
    s =  new FileReader();
  });

  it('should throw an error "Config file is not found"', ()=> {
    let configFile = './specs/config/testFiles/notFound.json';
    expect(function() {s.getConfig(configFile);})
      .toThrow(new Error('Config file is not found.'));

  });

  it('should throw an error "Config file is not found"', ()=> {
    expect(function() {s.getConfig();})
    .toThrow(new Error('Config file is not found.'));

  });

  it('should throw an error "Config file is not found"', ()=> {
    let configFile = './specs/config/testFiles/config-with-parse-error.json';
    expect(function() {
      s.getConfig(configFile);
    }).toThrow(new Error('An error occurs while parsing the config file.'));

  });

  it('should return config obj', ()=> {
    expect(s.getConfig('./specs/config/testFiles/config.json'))
      .toEqual({test: [123]});

  });

});
