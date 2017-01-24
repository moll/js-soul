var reduce = Function.call.bind(Array.prototype.reduce)

module.exports = function mix() {
  return reduce(arguments, function(parent, child) { return child(parent) })
}
