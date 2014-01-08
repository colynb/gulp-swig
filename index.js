var es = require('event-stream');
var swig = require('swig');
var clone = require('clone');
var ext = require('gulp-util').replaceExtension;
var fs = require('fs');

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

module.exports = function(options){
  'use strict';

  var opts = options ? clone(options) : {
      'ext': ".html"
  };

  function gulpswig(file, callback){

    var data = opts.data || {};

    if (opts.load_json === true) {
      var jsonPath = ext(file.path, '.json');
      var json = JSON.parse(fs.readFileSync(jsonPath));
      data = extend(json, data);
    }
    
    var newFile = clone(file);
    var tpl = swig.compileFile(file.path);
    var compiled = tpl(data);

    newFile.path = ext(newFile.path, opts.ext);
    newFile.contents = new Buffer(compiled);

    callback(null, newFile);
  }

  return es.map(gulpswig);
};
