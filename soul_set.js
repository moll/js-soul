var mix = require("./mix")
var Soul = mix(require("./soul"), require("./parseable"))
var defineGetter = require("oolong").defineGetter
var ITERATOR = typeof Symbol !== "undefined" ? Symbol.iterator : null
module.exports = SoulSet

function SoulSet(attrs) {
  this.children = new Set
  Soul.call(this, attrs)
}

SoulSet.prototype = Object.create(Soul.prototype, {
  constructor: {value: SoulSet, configurable: true, writeable: true}
})

defineGetter(SoulSet.prototype, "size", function() {
  return this.children.size
})

SoulSet.prototype["parse children"] = function(children) {
  children = children instanceof Set ? children : new Set(children)
  if (children.size === 0 && this.children.size === 0) return this.children
  return children
}

SoulSet.prototype.has = function(model) {
  return this.children.has(model)
}

SoulSet.prototype.add = function(child) {
  if (this.children.has(child)) return

  this.children.add(child)
  onChild(this, child)
  this.trigger("add", child)
}

SoulSet.prototype.remove = function(child) {
  if (!this.children.has(child)) return

  this.children.delete(child)
  offChild(this, child)
  this.trigger("remove", child)
}

SoulSet.prototype.values = function() {
  return this.children.values()
}

if (ITERATOR) SoulSet.prototype[ITERATOR] = function() {
  return this.children[ITERATOR]()
}

SoulSet.prototype.on("change", function(old) {
  if ("children" in old) {
    old.children.forEach(offChild.bind(null, this))
    this.children.forEach(onChild.bind(null, this))
  }
})

function onChild(self, child) {
  child.on("change", self.trigger, self, "child:change", child)
}

function offChild(self, child) {
  child.off("change", null, self)
}
