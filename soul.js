"use strict"
var Concert = require("concert")
var egal = require("egal")
var NON_ENUMERABLE = {enumerable: false}
module.exports = Soul

function Soul(attrs) {
  if (attrs !== undefined) this.set(attrs)
}

Soul.prototype.on = Concert.prototype.on
Soul.prototype.once = Concert.prototype.once
Soul.prototype.off = Concert.prototype.off
Soul.prototype.trigger = Concert.prototype.trigger

Soul.prototype.get = function(key) {
  return this[key]
}

Soul.prototype.set = function(attrs) {
  if (attrs == null || typeof attrs !== "object")
    throw new TypeError("Attributes must be an object: " + attrs)

  var old = diff(this, attrs)
  if (!isEmpty(old)) assign(this, attrs).trigger("change", old, attrs)
  return old
}

// Not aliasing Soul.prototype.inspect to toJSON intentionally as inspecting
// the full object with all enumerable properties is more useful in this case.
Soul.prototype.toJSON = function() {
  var obj = {}
  for (var key in this) obj[key] = this[key]
  return obj
}

unenumerate(Soul.prototype)

function diff(a, b) {
  var old = {}
  for (var key in b) if (!(key in a && egal(a[key], b[key]))) old[key] = a[key]
  return old
}

function unenumerate(obj) {
  Object.defineProperties(obj, mapValues(obj, constant(NON_ENUMERABLE)))
}

function mapValues(obj, fn) {
  var mapped = {}
  for (var key in obj) mapped[key] = fn(obj[key], key)
  return mapped
}

function assign(a, b) { for (var k in b) a[k] = b[k]; return a }
function constant(value) { return function() { return value } }
function isEmpty(obj) { for (obj in obj) return false; return true; }
