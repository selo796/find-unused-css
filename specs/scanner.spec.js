'use strict';

var Scanner = require('../src/scanner');

describe('Scanner Testing', function() {

    it('should return an error if no config obj exists', ()=> {
      var s =  new Scanner();
      expect(function() {s.run();})
        .toThrow(new Error('Config file is not found.'));
    });

    it('should return an error if htmlDirectory is not defined', ()=> {
      var s =  new Scanner({htmlWrong: './'});
      expect(function() {s.run();})
        .toThrow(
          new Error(
          'Please check your config file. No htmlDirectory is defined.'));
    });

    it('should return an error if cssFiles in config file not exists', ()=> {
      var s =  new Scanner({htmlDirectory: './', cssFilesWrong: ['asd']});
      expect(function() {s.run();})
      .toThrow(
        new Error('Please check your config file. No cssFiles is defined.'));
    });
  });
