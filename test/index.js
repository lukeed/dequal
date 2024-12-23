import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { dequal } from '../src';
import vm from 'vm';

function same(a, b) {
	assert.is(dequal(a, b), true);
}

function different(a, b) {
	assert.is(dequal(a, b), false);
}

const API = suite('exports');

API('exports', () => {
	assert.type(dequal, 'function');
});

API.run();

// ---

const scalars = suite('scalars');

scalars('scalars', () => {
	same(1, 1);
	different(1, 2);
	different(1, []);
	different(1, '1');
	same(Infinity, Infinity);
	different(Infinity, -Infinity);
	different(NaN, undefined);
	different(NaN, null);
	same(NaN, NaN);
	different(1, -1);
	same(0, -0);

	same(null, null);
	same(void 0, undefined);
	same(undefined, undefined);
	different(null, undefined);
	different('', null);
	different(0, null);

	same(true, true);
	same(false, false);
	different(true, false);
	different(0, false);
	different(1, true);

	same('a', 'a');
	different('a', 'b');
});

scalars.run();

// ---

const Objects = suite('Object');

Objects('Objects', () => {
	same({}, {});
	same({ a:1, b:2 }, { a:1, b:2 });
	same({ b:2, a:1 }, { a:1, b:2 });

	different({ a:1, b:2, c:[] }, { a:1, b:2 });
	different({ a:1, b:2 }, { a:1, b:2, c:[] });
	different({ a:1, c:3 }, { a:1, b:2 });

	same({ a:[{ b:1 }] }, { a:[{ b:1 }] });
	different({ a:[{ b:2 }] }, { a:[{ b:1 }] });
	different({ a:[{ c:1 }] }, { a:[{ b:1 }] });

	different([], {});
	different({}, []);
	different({}, null);
	different({}, undefined);

	different({ a:void 0 }, {});
	different({}, { a:undefined });
	different({ a:undefined }, { b:undefined });
});

Objects('dictionary', () => {
	const foo = Object.create(null);
	const bar = Object.create(null);
	same(foo, bar);

	foo.hello = 'world';
	different(foo, bar);
});

Objects.run();

// ---

const Arrays = suite('Array');

Arrays('Arrays', () => {
	same([], []);
	same([1,2,3], [1,2,3]);
	different([1,2,4], [1,2,3]);
	different([1,2], [1,2,3]);

	same([{ a:1 }, { b:2 }], [{ a:1 }, { b:2 }]);
	different([{ a:2 }, { b:2 }], [{ a:1 }, { b:2 }]);

	different({ '0':0, '1':1, length:2 }, [0, 1]);
});

Arrays('cross-realm arrays', () => {
	const context = vm.createContext({});
	const CrossRealmArray = vm.runInContext('Array', context);
	const arr1 = [1, 2, 3];
	const arr2 = new CrossRealmArray(1, 2, 3);
	same(arr1, arr2);
});

Arrays.run();

// ---

const Dates = suite('Date');

Dates('Dates', () => {
	same(
		new Date('2015-05-01T22:16:18.234Z'),
		new Date('2015-05-01T22:16:18.234Z')
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		new Date('2017-01-01T00:00:00.000Z')
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		'2015-05-01T22:16:18.234Z'
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		1430518578234
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		{}
	);
});

Dates.run();

// ---

const RegExps = suite('RegExp');

RegExps('RegExps', () => {
	same(/foo/, /foo/);
	same(/foo/i, /foo/i);

	different(/foo/, /bar/);
	different(/foo/, /foo/i);

	different(/foo/, 'foo');
	different(/foo/, {});
});

RegExps.run();

// ---

const Functions = suite('Function');

Functions('Functions', () => {
	let foo = () => {};
	let bar = () => {};

	same(foo, foo);
	different(foo, bar);
	different(foo, () => {});
});

Functions.run();

// ---

const Classes = suite('class');

Classes('class', () => {
	class Foobar {}
	same(new Foobar, new Foobar);
});

// @see https://github.com/lukeed/klona/issues/14
Classes('prototype', () => {
	function Test () {}
	Test.prototype.val = 42;

	same(new Test, new Test);
});

Classes('constructor properties', () => {
	function Test (num) {
		this.value = num;
	}

	Test.prototype.val = 42;

	same(new Test(123), new Test(123));
	different(new Test(0), new Test(123));
});

Classes('constructor properties :: class', () => {
	class Test {
		constructor(num) {
			this.value = num;
		}
	}

	same(new Test, new Test);
	same(new Test(123), new Test(123));
	different(new Test, new Test(123));
});

Classes('constructor properties :: defaults', () => {
	class Test {
		constructor(num = 123) {
			this.value = num;
		}
	}

	same(new Test(456), new Test(456));
	same(new Test(123), new Test);
});

Classes('accessors', () => {
	class Test {
		get val() {
			return 42;
		}
	}

	same(new Test, new Test);
});

Classes('values but not prototype', () => {
	class Item {
		constructor() {
			this.foo = 1;
			this.bar = 2;
		}
	}

	const hello = new Item;
	const world = {
		foo: 1,
		bar: 2,
	};

	assert.is(
		JSON.stringify(hello),
		JSON.stringify(world)
	);

	different(hello, world);

	hello.foo = world.foo;
	hello.bar = world.bar;

	different(hello, world);
});

Classes.run();

// ---

const Maps = suite('Map');

Maps('flat', () => {
	const hello = new Map();
	const world = new Map();

	same(hello, world);

	world.set('hello', 'world');
	different(hello, world);

	hello.set('foo', 'bar');
	different(hello, world);

	world.set('foo', 'bar');
	hello.set('hello', 'world');
	same(hello, world);
});

Maps('nested', () => {
	const hello = new Map([
		['foo', { a: 1 }],
		['bar', [1, 2, 3]],
	]);

	const world = new Map([
		['foo', 'bar']
	]);

	different(hello, world);

	// @ts-ignore
	world.set('foo', { a: 1 });
	different(hello, world);

	// @ts-ignore
	world.set('bar', [1, 2, 3]);
	same(hello, world);

	// @ts-ignore
	hello.set('baz', new Map([['hello', 'world']]));
	different(hello, world);

	// @ts-ignore
	world.set('baz', new Map([['hello', 'world']]));
	same(hello, world);
});

Maps('keys :: complex', () => {
	const hello = new Map([
		[{ foo:1 }, { a:1 }]
	]);

	const world = new Map([
		[{ foo:1 }, { a:1 }]
	]);

	same(hello, world);

	// @ts-ignore
	[...world.keys()][0].bar = 2;

	assert.equal([...hello.keys()][0], { foo:1 });
	assert.equal([...world.keys()][0], { foo:1, bar:2 });

	different(hello, world);
});

Maps('keys :: value-based', () => {
	different(
		new Map([
			[{ a: 1 }, undefined]
		]),
		new Map([
			[{ a: 1 }, {}]
		])
	);

	same(
		new Map([
			[{ a: 1 }, 1]
		]),
		new Map([
			[{ a: 1 }, 1]
		])
	);
});

Maps.run();

// ---

const Sets = suite('Set');

Sets('flat', () => {
	const hello = new Set();
	const world = new Set();

	same(hello, world);

	world.add('hello');
	different(hello, world);

	hello.add('foo');
	different(hello, world);

	world.add('foo');
	hello.add('hello');
	same(hello, world);
});

Sets('flat :: order', () => {
	const hello = new Set(['foo', 'bar']);
	const world = new Set(['bar', 'foo']);
	same(hello, world);
});

Sets('complex', () => {
	const hello = new Set([
		'foo', 'bar', { a: 1 }, [1, 2, 3]
	]);

	const world = new Set([
		'foo', { a: 1 }, 'bar'
	]);

	different(hello, world);

	// @ts-ignore
	world.add([1, 2, 3]);
	same(hello, world);

	world.delete('foo');
	different(hello, world);

	world.add('foo');
	same(hello, world);
});

Sets.run();

// ---

const TypedArrays = suite('TypedArray');

TypedArrays('Buffer', () => {
	same(
		Buffer.from('hello'),
		new Buffer('hello'),
	);

	different(
		Buffer.from('hello'),
		Buffer.from('world'),
	);

	different(
		Buffer.from('hello', 'base64'),
		Buffer.from('hello', 'utf8'),
	);
});

TypedArrays('Int16Array', () => {
	same(
		new Int16Array([42]),
		new Int16Array([42]),
	);

	different(
		new Int16Array([1, 2, 3]),
		new Int16Array([1, 2]),
	);

	different(
		new Int16Array([1, 2, 3]),
		new Int16Array([4, 5, 6]),
	);

	different(
		new Int16Array([1, 2, 3]),
		new Uint16Array([1, 2, 3]),
	);

	different(
		new Int16Array([1, 2, 3]),
		new Int8Array([1, 2, 3]),
	);
});

TypedArrays('Int32Array', () => {
	same(
		new Int32Array(new ArrayBuffer(4)),
		new Int32Array(new ArrayBuffer(4)),
	);

	different(
		new Int32Array(8),
		new Uint32Array(8),
	);

	different(
		new Int32Array(new ArrayBuffer(8)),
		new Int32Array(Array.from({ length: 8 })),
	);
});

TypedArrays('ArrayBuffer', () => {
	same(
		new ArrayBuffer(2),
		new ArrayBuffer(2),
	);

	different(
		new ArrayBuffer(1),
		new ArrayBuffer(2),
	);
});

TypedArrays('DataView', () => {
	same(
		new DataView(new ArrayBuffer(4)),
		new DataView(new ArrayBuffer(4)),
	);

	const hello = new Int8Array([1, 2, 3, 4, 5]);
	const world = new Int8Array([1, 2, 3, 4, 5]);

	same(hello, world);
	same(hello.buffer, world.buffer);

	same(
		new DataView(hello.buffer),
		new DataView(world.buffer)
	);

	hello.fill(0);

	different(hello, world);
	different(hello.buffer, world.buffer);

	different(
		new DataView(hello.buffer),
		new DataView(world.buffer)
	);
});

TypedArrays.run();

// ---

const kitchen = suite('kitchen');

kitchen('kitchen sink', () => {
	same({
    prop1: 'value1',
    prop2: 'value2',
    prop3: 'value3',
    prop4: {
      subProp1: 'sub value1',
      subProp2: {
        subSubProp1: 'sub sub value1',
        subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5]
      }
    },
    prop5: 1000,
    prop6: new Date(2016, 2, 10)
  }, {
    prop5: 1000,
    prop3: 'value3',
    prop1: 'value1',
    prop2: 'value2',
    prop6: new Date('2016/03/10'),
    prop4: {
      subProp2: {
        subSubProp1: 'sub sub value1',
        subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5]
      },
      subProp1: 'sub value1'
    }
  });
});

kitchen.run();
