# dequal [![CI](https://github.com/lukeed/dequal/workflows/CI/badge.svg)](https://github.com/lukeed/dequal/actions)

> A tiny (249B) utility to check for deep equality

This module supports comparison of all types, including `Function`, `RegExp`, `Date`, `null`, `undefined`, and `NaN` values. Objects and Arrays are traversed recursively.

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
import dequal from 'dequal';

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
Load times:
  assert:            0.111ms
  util:              0.007ms
  fast-deep-equal:   0.550ms
  lodash/isequal:   22.396ms
  nano-equal:        0.628ms
  dequal:            0.517ms

Validation:
  ✔ assert.deepStrictEqual
  ✔ util.isDeepStrictEqual
  ✔ fast-deep-equal
  ✔ lodash.isEqual
  ✔ nano-equal
  ✔ dequal

Benchmark:
  assert.deepStrictEqual x 208,260 ops/sec ±0.89% (94 runs sampled)
  util.isDeepStrictEqual x 209,764 ops/sec ±0.95% (95 runs sampled)
  fast-deep-equal        x 443,862 ops/sec ±0.86% (95 runs sampled)
  lodash.isEqual         x 194,133 ops/sec ±0.43% (95 runs sampled)
  nano-equal             x 414,957 ops/sec ±0.41% (98 runs sampled)
  dequal                 x 507,470 ops/sec ±0.60% (95 runs sampled)
```

## License

MIT © [Luke Edwards](https://lukeed.com)
