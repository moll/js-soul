var Sinon = require("sinon")
var Soul = require("..")
var SoulSet = require("../soul_set")

describe("SoulSet", function() {
  describe("new", function() {
    it("must be an instance of SoulSet", function() {
      new SoulSet().must.be.an.instanceof(SoulSet)
    })

    it("must set given children", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})
      var souls = new SoulSet({children: [a, b]})
      souls.has(a).must.be.true()
      souls.has(b).must.be.true()
    })
  })

  describe("children", function() {
    it("must be set", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})
      var souls = new SoulSet
      souls.set({children: [a, b]})
      souls.has(a).must.be.true(a)
      souls.has(b).must.be.true(b)
    })

    it("must trigger change given a new array", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})
      var souls = new SoulSet({children: [a]})

      var onChange = Sinon.spy()
      souls.on("change", onChange)

      souls.set({children: [b]})
      onChange.callCount.must.equal(1)
    })

    it("must not trigger change given empty array as before", function() {
      var souls = new SoulSet
      var onChange = Sinon.spy()
      souls.on("change", onChange)
      souls.set({children: []})
      onChange.callCount.must.equal(0)
    })
  })

  describe("size", function() {
    it("must return 0 by default", function() {
      new SoulSet().size.must.equal(0)
    })

    it("must return correct number after setting", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})
      new SoulSet({children: [a, b]}).size.must.equal(2)
    })
  })

  describe(".prototype.add", function() {
    it("must add child", function() {
      var souls = new SoulSet
      var soul = new Soul
      souls.add(soul)
      souls.has(soul).must.be.true()
    })

    it("must trigger add", function() {
      var souls = new SoulSet
      var onAdd = Sinon.spy()
      souls.on("add", onAdd)

      var soul = new Soul
      souls.add(soul)
      onAdd.callCount.must.equal(1)
      onAdd.firstCall.args[0].must.equal(soul)
    })

    it("must not trigger add if already added", function() {
      var souls = new SoulSet
      var soul = new Soul
      souls.add(soul)

      var onAdd = Sinon.spy()
      souls.on("add", onAdd)
      souls.add(soul)
      onAdd.callCount.must.equal(0)
    })

    it("must increment size", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})

      var souls = new SoulSet
      souls.size.must.equal(0)
      souls.add(a)
      souls.size.must.equal(1)
      souls.add(b)
      souls.size.must.equal(2)
    })
  })

  describe(".prototype.remove", function() {
    it("must remove child", function() {
      var souls = new SoulSet
      var soul = new Soul
      souls.add(soul)
      souls.remove(soul)
      souls.has(soul).must.be.false()
    })

    it("must trigger remove", function() {
      var souls = new SoulSet
      var onRemove = Sinon.spy()
      souls.on("remove", onRemove)

      var soul = new Soul
      souls.add(soul)
      souls.remove(soul)
      onRemove.callCount.must.equal(1)
      onRemove.firstCall.args[0].must.equal(soul)
    })

    it("must not trigger remove if not added", function() {
      var souls = new SoulSet
      var onRemove = Sinon.spy()
      souls.on("remove", onRemove)

      var soul = new Soul
      souls.remove(soul)
      onRemove.callCount.must.equal(0)
    })

    it("must decrement size", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})

      var souls = new SoulSet({children: [a, b]})
      souls.size.must.equal(2)
      souls.remove(a)
      souls.size.must.equal(1)
      souls.remove(b)
      souls.size.must.equal(0)
    })
  })

  describe(".prototype.values", function() {
    it("must return iterator over all children", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})
      var souls = new SoulSet({children: [a, b]})

      var iterator = souls.values()
      iterator.next.must.be.a.function()

      var array = Array.from(iterator)
      array.length.must.equal(2)
      array[0].must.equal(a)
      array[1].must.equal(b)
    })
  })

  describe(".prototype[@@iterator]", function() {
    it("must be used for Array.from", function() {
      var a = new Soul({id: 13})
      var b = new Soul({id: 42})
      var souls = new SoulSet({children: [a, b]})

      var array = Array.from(souls)
      array.length.must.equal(2)
      array[0].must.equal(a)
      array[1].must.equal(b)
    })
  })

  describe("on child change", function() {
    it("must trigger child:change", function() {
      var soul = new Soul({name: "John"})
      var souls = new SoulSet({children: [soul]})
      var onChange = Sinon.spy()
      souls.on("child:change", onChange)

      soul.set({name: "Jack"})
      onChange.callCount.must.equal(1)
      onChange.firstCall.args[0].must.equal(soul)
      onChange.firstCall.args[1].must.eql({name: "John"})
      onChange.firstCall.args[2].must.eql({name: "Jack"})
    })
  })
})
