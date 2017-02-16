var create = Object.create
var compose = require("lodash.compose")

module.exports = function(Soul) {
  function Parseable() { return Soul.apply(this, arguments) }

  Parseable.prototype = create(Soul.prototype, {
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

  var parsed, parser
  for (var key in attrs) if ((parser = "parse " + key) in this) {
    (parsed || (parsed = create(attrs)))[key] = this[parser](attrs[key])
  }

  return parsed || attrs
}
