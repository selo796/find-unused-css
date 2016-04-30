'use strict';

var AttributeFinder = require('../../src/html/attributeFinder');

var filePath = './specs/html/testAttributeFinderInHtml/test.html';
var filePath2 = './specs/html/testAttributeFinderInHtml/test2.html';

describe('Attribute Finder Testing', function() {

  it('should find all classes', (done)=> {

    var s =  new AttributeFinder();

    s.findAttribute(filePath).then((attributes) => {
      expect(attributes._class).toEqual(['breadcrumb','okok','active','panel',
			'container','panel-heading','panel-title','panel-body','row','col-lg-4',
			'col-md-4','col-sm-6','col-xs-12','thumbnail','caption','category-text',
      'category-button-container','btn','btn-rosa',  'col-lg-3',  'col-md-3']);

      s.findAttribute(filePath2).then((attributes) => {
        expect(attributes._class).toEqual(['breadcrumb','okok','active','panel',
				'container','panel-heading','panel-title', 'panel-body','row','col-lg-4',
				'col-md-4','col-sm-6','col-xs-12','thumbnail','caption','category-text',
				'category-button-container','btn','btn-rosa',  'col-lg-3',  'col-md-3',
				'test2', 'btn-big']);
        done();
      },function(err) {
        console.log('classes err: ', err);
        done();
      });
    },(err)=> {
      console.log('classes err: ', err);
      done();
    });
  });

  it('should find all id attributes', function(done) {
    var s =  new AttributeFinder();

    s.findAttribute(filePath).then((attributes)=> {
      expect(attributes._id).toEqual(['id1', 'id2', 'id3']);

      s.findAttribute(filePath2).then((attributes)=> {
        expect(attributes._id)
				.toEqual(['id1', 'id2', 'id3', 'id4', 'id5', 'id6']);
        done();
      }, function(err) {
        console.log('classes err: ', err);
        done();
      });

    },function(err) {
      console.log('classes err: ', err);
      done();
    });

  });
});
