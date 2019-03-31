var es = require('event-stream')
var swig = require('swig-templates')
var clone = require('clone')
var replaceExt = require('replace-ext')
var PluginError = require('plugin-error')
var fs = require('fs')
var path = require('path')

function extend(target) {
  'use strict'
  var sources = [].slice.call(arguments, 1)
  sources.forEach(function(source) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop]
      }
    }
  })
  return target
}

module.exports = function(options) {
  'use strict'

  var opts = options ? clone(options) : {}
  opts.ext = opts.ext || '.html'

  if (opts.defaults) {
    swig.setDefaults(opts.defaults)
  }

  if (opts.setup && typeof opts.setup === 'function') {
    opts.setup(swig)
  }

  function gulpswig(file, callback) {
    var data = opts.data || {},
      jsonPath

    if (typeof data === 'function') {
      data = data(file)
    }

    if (file.data) {
      data = extend(file.data, data)
    }

    if (opts.load_json === true) {
      if (opts.json_path) {
        jsonPath = path.join(
          opts.json_path,
          replaceExt(path.basename(file.path), '.json')
        )
      } else {
        jsonPath = replaceExt(file.path, '.json')
      }

      // skip error if json file doesn't exist
      try {
        data = extend(JSON.parse(fs.readFileSync(jsonPath)), data)
      } catch (err) {}
    }

    try {
      var _swig = opts.varControls ? new swig.Swig(opts) : swig
      var tpl = _swig.compile(String(file.contents), { filename: file.path })
      var compiled = tpl(data)

      file.path = replaceExt(file.path, opts.ext)
      file.contents = Buffer.from(compiled)

      callback(null, file)
    } catch (err) {
      callback(new PluginError('gulp-swig', err))
      callback()
    }
  }

  return es.map(gulpswig)
}
