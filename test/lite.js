import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { dequal } from '../src/lite';
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

Arrays("cross-realm arrays", () => {
	const context = vm.createContext({});
	const CrossRealmArray = vm.runInContext("Array", context);
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
