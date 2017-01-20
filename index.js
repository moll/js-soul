"use strict"
var Concert = require("concert")
var isEmpty = require("oolong").isEmpty
var map = require("oolong").map
var reject = require("oolong").reject
var egal = require("egal")
var NON_ENUMERABLE = {enumerable: false}
module.exports = Soul

function Soul(attrs) {
  if (typeof attrs === "object") this.set(attrs)
}

Soul.prototype.on = Concert.prototype.on
Soul.prototype.once = Concert.prototype.once
Soul.prototype.off = Concert.prototype.off
Soul.prototype.trigger = Concert.prototype.trigger

Soul.prototype.get = function(key) {
  return this[key]
}

Soul.prototype.set = function(key, value) {
  if (key == null) throw new TypeError("Attributes must be an object: " + key)

  var attrs
  if (typeof key !== "object") (attrs = {})[key] = value
  else attrs = key

  var old = diff(this, attrs)
  if (isEmpty(old)) return this

  assign(this, attrs)
  this.trigger("change", old, attrs)
  return this
}

// No Soul.prototype.inspect alias intentionally as inspecting the full
// object with all enumerable properties is more useful in this case.
Soul.prototype.toJSON = function() { return reject(this, isUndefined) }

unenumerate(Soul.prototype)

function diff(a, b) {
  var old = {}
  for (var key in b) if (!(key in a && egal(a[key], b[key]))) old[key] = a[key]
  return old
}

function unenumerate(obj) {
  Object.defineProperties(obj, map(obj, constant(NON_ENUMERABLE)))
}

function assign(a, b) { for (var k in b) a[k] = b[k]; return a }
function constant(value) { return function() { return value } }
function isUndefined(value) { return value === undefined }
