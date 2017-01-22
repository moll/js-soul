var Soul = require("..")
var Sinon = require("sinon")
var Parseable = require("../parseable")
var mix = require("../mix")
var Model = mix(Soul, Parseable)

describe("Parseable", function() {
  describe("new", function() {
    it("must be an instance of Soul", function() {
      new Model().must.be.an.instanceof(Soul)
    })

    it("must be an instance of Parseable", function() {
      new Model().must.be.an.instanceof(Model)
    })

    it("must be empty by defualt", function() {
      new Model().must.be.empty()
    })
  })

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
      model["parse name"] = function(name) { return name + "!" }
      model["parse age"] = function(age) { return age * 2 }

      model.set({name: "John", age: 21})
      model.name.must.equal("John!")
      model.age.must.equal(42)
    })

    it("must call parser in the context of the model", function() {
      var model = new Model
      model["parse name"] = Sinon.spy()
      model.set({name: "John"})
      model["parse name"].thisValues[0].must.equal(model)
    })

    it("must not modify given attributes", function() {
      var model = new Model
      model["parse name"] = function(name) { return name + "!" }
      var attrs = {name: "John"}
      model.set(attrs)
      attrs.must.eql({name: "John"})
    })
  })
})
