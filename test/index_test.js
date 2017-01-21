var O = require("oolong")
var Soul = require("..")
var Sinon = require("sinon")
var demand = require("must")

describe("Soul", function() {
  describe("new", function() {
    it("must be an instance of Soul", function() {
      new Soul().must.be.an.instanceof(Soul)
    })

    it("must be empty by defualt", function() {
      new Soul().must.be.empty()
    })

    it("must throw TypeError given null", function() {
      var err
      try { new Soul(null) } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must throw TypeError given a string", function() {
      var err
      try { new Soul("name") } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must set given attributes", function() {
      var model = new Soul({name: "John", age: 42})
      model.get("name").must.equal("John")
      model.get("age").must.equal(42)
    })

    it("must have given attributes as properties", function() {
      var model = new Soul({name: "John", age: 42})
      model.must.eql(O.assign(new Soul, {name: "John", age: 42}))
    })

    it("must not modify given attributes", function() {
      var attrs = {name: "John"}
      new Soul(attrs)
      attrs.must.eql({name: "John"})
    })

    it("must call set", function() {
      var model = Object.create(Soul.prototype)
      model.set = Sinon.spy(Soul.prototype.set.bind(model, {name: "Mike"}))

      var attrs = {name: "John"}
      Soul.call(model, attrs)
      model.name.must.equal("Mike")
      model.set.callCount.must.equal(1)
      model.set.firstCall.args[0].must.equal(attrs)
    })

    it("must trigger change for given attributes", function() {
      var model = Object.create(Soul.prototype)
      model.age = 42
      var onChange = Sinon.spy()
      model.on("change", onChange)
      Soul.call(model, {name: "John", age: 42})

      onChange.callCount.must.equal(1)
      onChange.firstCall.args[0].must.eql({name: undefined})
      onChange.firstCall.args[1].must.eql({name: "John", age: 42})
    })

    it("must not trigger change if nothing changed", function() {
      var model = Object.create(Soul.prototype)
      model.age = 42
      var onChange = Sinon.spy()
      model.on("change", onChange)
      Soul.call(model, {age: 42})
      onChange.callCount.must.equal(0)
    })

    describe("when inherited", function() {
      function Model(attrs) { return Soul.call(this, attrs) }

      Model.prototype = Object.create(Soul.prototype, {
        constructor: {value: Model, configurable: true, writeable: true}
      })

      it("must return an empty model given nothing", function() {
        var model = new Model
        model.must.be.an.instanceof(Model)
        model.must.be.empty()
      })

      it("must return a model given attributes", function() {
        var model = new Model({name: "John"})
        model.must.be.an.instanceof(Model)
        model.must.eql(O.create(Model.prototype, {name: "John"}))
      })
    })
  })

  describe(".prototype.get", function() {
    it("must be a non-enumerable function", function() {
      var model = new Soul
      model.get.must.be.a.function()
      model.must.have.nonenumerable("get")
    })

    it("must return attribute", function() {
      new Soul({name: "John"}).get("name").must.equal("John")
    })

    it("must return undefined if attribute not set", function() {
      demand(new Soul().get("name")).be.undefined()
    })

    it("must return inherited property", function() {
      new Soul().get("hasOwnProperty").must.be.a.function()
    })
  })

  describe(".prototype.set", function() {
    it("must be a non-enumerable function", function() {
      var model = new Soul
      model.set.must.be.a.function()
      model.must.have.nonenumerable("set")
    })

    it("must throw TypeError given undefined", function() {
      var err
      try { new Soul().set(undefined) } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must throw TypeError given null", function() {
      var err
      try { new Soul().set(null) } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must throw TypeError given a string", function() {
      var err
      try { new Soul().set("name", "John") } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /attributes/i)
    })

    it("must set undefined attribute if not set before", function() {
      var model = new Soul().set({name: undefined})
      model.must.have.property("name", undefined)
    })

    it("must trigger change for given attributes", function() {
      var model = new Soul()
      model.age = 42

      var onChange = Sinon.spy()
      model.on("change", onChange)
      model.set({name: "John", age: 42})

      onChange.callCount.must.equal(1)
      onChange.firstCall.args[0].must.eql({name: undefined})
      onChange.firstCall.args[1].must.eql({name: "John", age: 42})
    })

    it("must not trigger change if nothing changed", function() {
      var model = new Soul()
      model.age = 42

      var onChange = Sinon.spy()
      model.on("change", onChange)
      model.set({age: 42})

      onChange.callCount.must.equal(0)
    })

    it("must not throw TypeError when changing a nonextensible object",
      function() {
      var model = Object.preventExtensions(new Soul({name: null}))
      model.set({name: "John"})
      model.name.must.equal("John")
    })

    it("must throw TypeError when adding to a nonextensible object",
      function() {
      var model = Object.preventExtensions(new Soul({name: null}))
      var err
      try { model.set({age: 13}) } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /not extensible/i)
      model.must.not.have.property("age")
    })

    it("must not throw TypeError when changing a sealed object", function() {
      var model = Object.seal(new Soul({name: null}))
      model.set({name: "John"})
      model.name.must.equal("John")
    })

    it("must throw TypeError when adding to a sealed object", function() {
      var model = Object.seal(new Soul({name: null}))
      var err
      try { model.set({age: 13}) } catch (ex) { err = ex }
      err.must.be.an.error(TypeError, /not extensible/i)
      model.must.not.have.property("age")
    })

    describe("given object", function() {
      it("must return self", function() {
        var soul = new Soul
        soul.set({life: 42}).must.equal(soul)
      })

      it("must set attributes", function() {
        var soul = new Soul().set({life: 42, death: 69})
        soul.must.eql(new Soul({life: 42, death: 69}))
      })

      it("must set inherited attributes", function() {
        var obj = Object.create({name: "John"})
        obj.age = 42
        new Soul().set(obj).must.eql(new Soul({name: "John", age: 42}))
      })
    })
  })

  describe(".prototype.toJSON", function() {
    it("must return attributes as own", function() {
      var model = new Soul({name: "John"})
      model = O.create(model, {age: 42})
      var obj = model.toJSON()
      obj.must.eql({name: "John", age: 42})
      obj.must.have.own("name")
      obj.must.have.own("age")
    })

    it("must not return undefined attributes", function() {
      var model = new Soul({age: 42, name: undefined})
      model.toJSON().must.eql({age: 42})
    })

    it("must return null attributes", function() {
      var model = new Soul({name: null, age: 42})
      model.toJSON().must.eql({name: null, age: 42})
    })
  })
})
