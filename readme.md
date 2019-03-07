# dequal [![Build Status](https://badgen.now.sh/travis/lukeed/dequal)](https://travis-ci.org/lukeed/dequal)

> A tiny (247B) utility to check for deep equality

This module supports comparison of all types, including `Function`, `RegExp`, `Date`, `null`, `undefined`, and `NaN` values.<br>
Objects and Arrays are traversed recursively.

> Please note that key order **within Objects** does not matter.<br>
However, the value order **within Arrays** does matter.

This module exposes three module definitions:

* **CommonJS**: `dist/dequal.js`
* **ESModule**: `dist/dequal.mjs`
* **UMD**: `dist/dequal.min.js`


## Install

```
$ npm install --save dequal
```


## Usage

```js
const dequal = require('dequal');

dequal(1, 1); //=> true
dequal({}, {}); //=> true
dequal('foo', 'foo'); //=> true
dequal([1, 2, 3], [1, 2, 3]); //=> true
dequal(dequal, dequal); //=> true
dequal(/foo/, /foo/); //=> true
dequal(null, null); //=> true
dequal(NaN, NaN); //=> true
dequal([], []); //=> true
dequal(
  [{ a:1 }, [{ b:{ c:[1] } }]],
  [{ a:1 }, [{ b:{ c:[1] } }]]
); //=> true

dequal(1, '1'); //=> false
dequal(null, undefined); //=> false
dequal({ a:1, b:[2,3] }, { a:1, b:[2,5] }); //=> false
dequal(/foo/i, /bar/g); //=> false
```

## API

### dequal(foo, bar)
Returns: `Boolean`

Both `foo` and `bar` can be of any type.<br>
A `Boolean` is returned indicating if the two were deeply equal.


## Benchmarks

> Running Node v10.13.0

```
fast-deep-equal   x 214,365 ops/sec ±0.30% (93 runs sampled)
dequal            x 160,116 ops/sec ±0.29% (93 runs sampled)
lodash.isEqual    x  45,257 ops/sec ±0.26% (95 runs sampled)
```
<sup>_Candidates operate identically to one another_</sup>

## License

MIT © [Luke Edwards](https://lukeed.com)
