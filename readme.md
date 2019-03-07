# dequal [![Build Status](https://badgen.now.sh/travis/lukeed/dequal)](https://travis-ci.org/lukeed/dequal)

> A tiny (247B) utility to check for deep equality

This module supports comparison of all types, including `Function`, `RegExp`, `Date`, `null`, `undefined`, and `NaN` values.<br>
Objects and Arrays are traversed recursively.

> Please note that key order **within Objects** does not affect the result.<br>
However, the value order **within Arrays** does matter.

This module exposes two module definitions:

* **ES Module**: `dist/dequal.mjs`
* **CommonJS**: `dist/dequal.js`
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

Both `foo` and `bar` can be on any type.<br>
A `Boolean` is returned indicating if the two were deeply equal.


## License

MIT © [Luke Edwards](https://lukeed.com)
