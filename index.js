var es = require('event-stream');
var compile = require('swig');
var clone = require('clone');
var ext = require('gulp-util').replaceExtension;

module.exports = function(options){
  'use strict';

  var opts = options ? clone(options) : {};

  function swig(file, callback){
    var newFile = clone(file);
    opts.filename = file.path;

    var tpl = compile.compileFile(file.path);
    var compiled = tpl(opts.data);

    newFile.path = ext(newFile.path, '.html');
    newFile.shortened = newFile.shortened && ext(newFile.shortened, '.html');
    newFile.contents = new Buffer(compiled);

    callback(null, newFile);
  }

  return es.map(swig);
};
