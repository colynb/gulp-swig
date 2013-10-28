var gulp = require('gulp');
var expect = require('chai').expect;
var task = require('../');
var compile = require('swig');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var extname = require('path').extname;

require('mocha');

describe('gulp-swig compilation', function(){

  'use strict';

  describe('gulp-swig', function(){

    var filename = path.join(__dirname, './fixtures/test.html');

    function expectStream(done, options){
      options = options || {};
      var ext = '.html';
      return es.map(function(file){
        options.filename = filename;
        var tpl = compile.compileFile(filename);
        var expected = tpl({message:'hello'});
        expect(expected).to.equal(String(file.contents));
        expect(extname(file.path)).to.equal(ext);
        if(file.shortened){
          expect(extname(file.shortened)).to.equal(ext);
        } else {
          expect(extname(file.shortened)).to.equal('');
        }
        done();
      });
    }

    it('should compile my swig files into HTML', function(done){
      gulp.src(filename)
        .pipe(task({data:{message:'hello'}}))
        .pipe(expectStream(done));
    });

  });

});
