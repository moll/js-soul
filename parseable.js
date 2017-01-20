"use strict"
var compose = require("lodash.compose")

module.exports = function(Soul) {
  function Parseable() { Soul.apply(this, arguments) }

  Parseable.prototype = Object.create(Soul.prototype, {
    constructor: {value: Parseable, configurable: true, writeable: true},
    parse: {value: exports.parse, configurable: true, writeable: true},

    set: {
      value: compose(Soul.prototype.set, exports.set),
      configurable: true,
      writeable: true
    }
  })

  return Parseable
}

exports.set = function(key, value) {
  return this.parse(key, value)
}

exports.parse = function parse(key, value) {
  var attrs
  if (typeof key !== "object") (attrs = {})[key] = value
  else attrs = key

  attrs = Object.create(attrs)

  for (key in attrs) {
    var name = "set " + key
    if (name in this) attrs[key] = this[name](attrs[key])
  }

  return attrs
}
