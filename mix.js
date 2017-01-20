var reduce = Function.call.bind(Array.prototype.reduce)

module.exports = function mix() {
  return reduce(arguments, (parent, child) => child(parent))
}
