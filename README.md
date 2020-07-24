Soul.js
=======
[![NPM version][npm-badge]](https://www.npmjs.com/package/soul)

Soul.js is a **simple yet extensible** **mutable model library** for JavaScript. Soul.js compares attributes when setting and informs of changes via the **observer pattern** (a.k.a publish/subscribe) by emitting a `change` event with the changes. Relying on the tiny [Egal.js](https://github.com/moll/js-egal) for attribute comparisons **permits comparing value objects** (like `Date`s) along with primitives out of the box. Soul.js is most suitable for **front-end user interfaces** where a few observable models among otherwise functional rendering go long a way.

Soul.js's simple design also lends itself to easy subclassing and mixins. One mixin, `Parseable`, is included for letting you define functions for parsing individual attributes. See below for [how to parse individual attributes before setting](#parsing-attributes)

[npm-badge]: https://img.shields.io/npm/v/soul.svg


Installing
----------
```sh
npm install soul
```

Soul.js follows [semantic versioning](http://semver.org), so feel free to depend on its major version with something like `>= 1.0.0 < 2` (a.k.a `^1.0.0`).


Using
-----
The simplest way to use Soul.js is just to require `soul` and create a few model instances:

```javascript
var Soul = require("soul")
var john = new Soul({name: "John", age: 42})
```

The set attributes are available as plain properties on the `Soul` instance:

```javascript
john.name // => "John"
john.age // => 42
```

To then be notified of when `john` changes, listen to its `change` event:

```javascript
john.on("change", function(old) {
  if ("age" in old) console.log("John aged to " + old.age)
})
```

Then, set John's attributes with `Soul.prototype.set`:

```javascript
john.set({age: 43})
```

The given attributes are then compared to their current values (the given `age` of `43` is compared to `42` set prior, for example) and `change` gets triggered if any were different. The `change` event gets triggered only once per `Soul.prototype.set` call. This way you can handle multiple attribute changes together and trigger a UI rerender only once, for example.

The `change` event is triggered with two arguments. The first being the old attribute values for only those attributes that changed (permitting you to identify which attributes changed). The second is the attribute object that was passed to `Soul.prototype.set`. This could help identify when to overwrite attributes and when not to:

```javascript
john.on("change", function(old, set) {
  // Set the updatedAt attribute only if it wasn't explicitly given.
  if (set.updatedAt == null) this.updatedAt = new Date
})

// The following call sets john.updatedAt to `new Date` in the change handler.
john.set({age: 43})

// The updatedAt attribute gets set to new Date(2015, 5, 18) and isn't
// overwritten in the `change` handler as `set.updatedAt` will be present.
john.set({age: 44, updatedAt: new Date(2015, 5, 18)})
```

As Soul.js relies on [Egal.js](https://github.com/moll/js-egal) to compare attribute values, Soul.js correctly identifies changes, or lack of, in `Date`s and other value objects.

For symmetry, there's also `Soul.prototype.get`, but that's really just identical to accessing the property on the object directly:

```javascript
var john = new Soul({name: "John"})
john.get("name") // => "John"
john.name // => "John"
```

### Subclassing Soul
Subclassing `Soul` has a few advantages over using it directly.

- You can identify object types with the `instanceof` operator.
- You can add methods to all object instances.
- You can pre-bind event handlers.

As `Soul` is a regular JavaScript class (constructor and prototype), you can subclass it either with the ECMAScript 5 syntax or with the ECMAScript 6 syntax.

Here's how ECMAScript 5-compatible subclassing would look like:

```javascript
var Soul = require("soul")

function Person(attrs) {
  Soul.call(this, attrs)
}

Person.prototype = Object.create(Object.prototype, {
  constructor: {value: Person, configurable: true, writeable: true}
})
```

And ECMAScript 6 subclassing:

```javascript
var Soul = require("soul")

class Person extends Soul {}
```

Regardless of which way you've subclassed `Soul`, you can then create and identify your `Person` instances with `instanceof`:

```javascript
var john = new Person({name: "John", age: 42})
john instanceof Person // => true
```

With a subclass, you can also add methods to all `Person` instances at once:

```javascript
Person.prototype.isSemicentennial = function() {
  return this.age >= 50
}

var john = new Person({name: "John", age: 42})
john.isSemicentennial() // => false

var mary = new Person({name: "Mary", age: 69})
mary.isSemicentennial() // => true
```

### Prototype Event Handlers
As Soul.js relies on [Concert.js](https://github.com/moll/js-concert) for event functionality (i.e the `change` event), Soul.js supports setting event handlers on the prototype (class) once. This makes Soul.js unique among other model libraries in that you don't have to set the same event listeners every time in the class constructor during runtime.

For example, if you want all `Person` instances to have a `updatedAt` attribute tracking their last change time, you could bind the `change` event once:

```javascript
Person.prototype.on("change", function(old) {
  this.updatedAt = new Date
})
```

Next time a new `Person` is created, that change handler will already be present. It won't interfere with new handlers set after instantiating either. You get the best of both worlds.

```javascript
var john = new Person({name: "John", age: 42})
john.set({age: 43})
john.updatedAt // => Current time
```

Note that `change` is not triggered when creating a `Soul`/`Person` instance. If you want `updatedAt` to be initialized, set it in the constructor function (`Person` in the above subclassing example).

### Parsing Attributes
Soul.js comes with a simple mixin that enables parsing of individual attributes.

Mixing in `Parseable` consists of passing `Soul` to it and getting a new class back:

```javascript
var Soul = require("soul")
var Parseable = require("soul/parseable")
var ParseableSoul = Parseable(Soul)
```

Then subclass from `ParseableSoul` instead of `Soul`. Next, define parsing functions for individual attributes by prefixing them with `parse ` (incl. space). To parse the `name` attribute, define a `parse name` function taking in a value and returning a new parsed value.

Using the ECMAScript 6 syntax makes it rather succinct:

```javascript
var Soul = require("soul")
var Parseable = require("soul/parseable")

class Person extends Parseable(Soul) {
  "parse name"(name) {
    return name[0].toUpperCase() + name.slice(1)
  }
}
```

Next time you construct a new `Person` instance or call `Person.prototype.set`, `name` gets passed to your parsing function and only then compared it the existing attribute value:

```javascript
var john = new Person({name: "john"})
john.name // => "John"
john.set({name: "john"}) // => No "change" event as "john" parses to "John"
john.name // => "John"
john.set({name: "johnny"}) // => "change" event
john.name // => "Johnny"
```


License
-------
Soul.js is released under a *Lesser GNU Affero General Public License*, which in summary means:

- You **can** use this program for **no cost**.
- You **can** use this program for **both personal and commercial reasons**.
- You **do not have to share your own program's code** which uses this program.
- You **have to share modifications** (e.g. bug-fixes) you've made to this program.

For more convoluted language, see the `LICENSE` file.


About
-----
**[Andri Möll][moll]** typed this and the code.  
[Monday Calendar][monday] supported the engineering work.

If you find Soul.js needs improving, please don't hesitate to type to me now at [andri@dot.ee][email] or [create an issue online][issues].

[email]: mailto:andri@dot.ee
[issues]: https://github.com/moll/js-soul/issues
[moll]: https://m811.com
[monday]: https://mondayapp.com
