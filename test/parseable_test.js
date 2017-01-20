var Soul = require("..")
var Sinon = require("sinon")
var Parseable = require("../parseable")
var mix = require("../mix")
var Model = mix(Soul, Parseable)

describe("Parseable", function() {
  describe(".prototype.set", function() {
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
      model.set("name", "John")
      model["set name"].thisValues[0].must.equal(model)
    })
  })
})
