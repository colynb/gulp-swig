var gulp = require('gulp');
var expect = require('chai').expect;
var task = require('../');
var es = require('event-stream');
var path = require('path');
var extname = path.extname;

require('mocha');

describe('gulp-swig compilation', function(){

  'use strict';

  describe('gulp-swig', function(){

    var filename = path.join(__dirname, './fixtures/test.html');

    function expectStream(done, options){
      options = options || {};
      var ext = '.html';
      return es.map(function(file){
        var result = String(file.contents);
        var expected = options.expected;
        expect(result).to.equal(expected);
        expect(extname(file.path)).to.equal(ext);
        done();
      });
    }

    it('should compile my swig files into HTML with data obj', function(done){
      var opts = {
        data : {
          message1 : 'hello'
        },
        expected : '<div class="layout">hello</div>'
      };
      gulp.src(filename)
        .pipe(task(opts))
        .pipe(expectStream(done, opts));
    });

    it('should compile my swig files into HTML with json file', function(done){
      var opts = {
        load_json: true,
        expected : '<div class="layout">hello</div>'
      };
      gulp.src(filename)
        .pipe(task(opts))
        .pipe(expectStream(done, opts));
    });

    it('should compile my swig files into HTML with both data obj and json file', function(done){
      var opts = {
        load_json: true,
        data: {
          message2: "world"
        },
        expected : '<div class="layout">helloworld</div>'
      };
      gulp.src(filename)
        .pipe(task(opts))
        .pipe(expectStream(done, opts));
    });

  });

});
