var compose = require("lodash.compose")

module.exports = function(Soul) {
  function Parseable() { Soul.apply(this, arguments) }

  Parseable.prototype = Object.create(Soul.prototype, {
    constructor: {value: Parseable, configurable: true, writeable: true},
    parse: {value: parse, configurable: true, writeable: true},

    set: {
      value: compose(Soul.prototype.set, set),
      configurable: true,
      writeable: true
    }
  })

  return Parseable
}

function set(attrs) {
  return this.parse(attrs)
}

function parse(attrs) {
  if (attrs == null || typeof attrs !== "object")
    throw new TypeError("Attributes must be an object: " + attrs)

  attrs = Object.create(attrs)

  for (var key in attrs) {
    var name = "parse " + key
    if (name in this) attrs[key] = this[name](attrs[key])
  }

  return attrs
}
