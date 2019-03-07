const test = require('tape');
const fn = require('../dist/dequal');

const log = x => JSON.stringify(x);

test.Test.prototype.true = function (a, b) {
	this.is(fn(a, b), true, `~> true: ${log(a)} VS ${log(b)}`);
};

test.Test.prototype.false = function (a, b) {
	this.is(fn(a, b), false, `~> false: ${log(a)} VS ${log(b)}`);
};

test('exports', t => {
	t.is(typeof fn, 'function', 'exports a function');
	t.end();
});

test('scalars', t => {
	t.true(1, 1);
	t.false(1, 2);
	t.false(1, []);
	t.false(1, '1');
	t.true(Infinity, Infinity);
	t.false(Infinity, -Infinity);
	t.false(NaN, undefined);
	t.false(NaN, null);
	t.true(NaN, NaN);
	t.false(1, -1);
	t.true(0, -0);

	t.true(null, null);
	t.true(void 0, undefined);
	t.true(undefined, undefined);
	t.false(null, undefined);
	t.false('', null);
	t.false(0, null);

	t.true(true, true);
	t.true(false, false);
	t.false(true, false);
	t.false(0, false);
	t.false(1, true);

	t.true('a', 'a');
	t.false('a', 'b');

	t.end();
});

test('Objects', t => {
	t.true({}, {});
	t.true({ a:1, b:2 }, { a:1, b:2 });
	t.true({ b:2, a:1 }, { a:1, b:2 });

	t.false({ a:1, b:2, c:[] }, { a:1, b:2 });
	t.false({ a:1, b:2 }, { a:1, b:2, c:[] });
	t.false({ a:1, c:3 }, { a:1, b:2 });

	t.true({ a:[{ b:1 }] }, { a:[{ b:1 }] });
	t.false({ a:[{ b:2 }] }, { a:[{ b:1 }] });
	t.false({ a:[{ c:1 }] }, { a:[{ b:1 }] });

	t.false([], {});
	t.false({}, []);
	t.false({}, null);
	t.false({}, undefined);

	t.false({ a:void 0 }, {});
	t.false({}, { a:undefined });
	t.false({ a:undefined }, { b:undefined });

	t.end();
});

test('Arrays', t => {
	t.true([], []);
	t.true([1,2,3], [1,2,3]);
	t.false([1,2,4], [1,2,3]);
	t.false([1,2], [1,2,3]);

	t.true([{ a:1 }, { b:2 }], [{ a:1 }, { b:2 }]);
	t.false([{ a:2 }, { b:2 }], [{ a:1 }, { b:2 }]);

	t.false({ '0':0, '1':1, length:2 }, [0, 1]);

	t.end();
});

test('Dates', t => {
	t.true(
		new Date('2015-05-01T22:16:18.234Z'),
		new Date('2015-05-01T22:16:18.234Z')
	);

	t.false(
		new Date('2015-05-01T22:16:18.234Z'),
		new Date('2017-01-01T00:00:00.000Z')
	);

	t.false(
		new Date('2015-05-01T22:16:18.234Z'),
		'2015-05-01T22:16:18.234Z'
	);

	t.false(
		new Date('2015-05-01T22:16:18.234Z'),
		1430518578234
	);

	t.false(
		new Date('2015-05-01T22:16:18.234Z'),
		{}
	);

	t.end();
});

test('RegExps', t => {
	t.true(/foo/, /foo/);
	t.true(/foo/i, /foo/i);

	t.false(/foo/, /bar/);
	t.false(/foo/, /foo/i);

	t.false(/foo/, 'foo');
	t.false(/foo/, {});

	t.end();
});

test('Functions', t => {
	let foo = () => {};
	let bar = () => {};

	t.true(foo, foo);
	t.false(foo, bar);
	t.false(foo, () => {});

	t.end();
});

test('kitchen sink', t => {
	t.true({
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

	t.end();
});
