var Sinon = require("sinon")
var Parseable = require("../parseable")
var mix = require("../mix")
var Model = mix(require(".."), Parseable)

describe("Parseable", function() {
  describe(".prototype.set", function() {
    it("must throw TypeError given undefined", function() {
      var err
      try { new Model().set(undefined) } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must throw TypeError given null", function() {
      var err
      try { new Model().set(null) } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must throw TypeError given a string", function() {
      var err
      try { new Model().set("name", "John") } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must call parsers", function() {
      var model = new Model
      model["set name"] = function(name) { return name + "!" }
      model["set age"] = function(age) { return age * 2 }

      model.set({name: "John", age: 21})
      model.name.must.equal("John!")
      model.age.must.equal(42)
    })

    it("must call parser in the context of the model", function() {
      var model = new Model
      model["set name"] = Sinon.spy()
      model.set({name: "John"})
      model["set name"].thisValues[0].must.equal(model)
    })
  })
})
