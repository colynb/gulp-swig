var es = require('event-stream');
var swig = require('swig');
var clone = require('clone');
var ext = require('gulp-util').replaceExtension;
var fs = require('fs');

function extend(target) {
    'use strict';
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
        }
    });
    return target;
}

module.exports = function(options){
  'use strict';

  var opts = options ? clone(options) : {};
  opts.ext = opts.ext || ".html";

  if (opts.defaults) {
    swig.setDefaults(opts.defaults);
  }

  if (opts.setup && typeof opts.setup === 'function') {
    opts.setup(swig);
  }

  function gulpswig(file, callback){

    var data = opts.data || {};

    if (typeof data === 'function') {
      data = data(file);
    }

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
