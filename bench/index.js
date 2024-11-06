const { join } = require('path');
const { Suite } = require('benchmark');
const klona = require('klona');

console.log('Load times:');

console.time('assert');
const { deepStrictEqual } = require('assert');
console.timeEnd('assert');

console.time('util');
const { isDeepStrictEqual } = require('util');
console.timeEnd('util');

console.time('deep-equal');
const deepEqual = require('deep-equal');
console.timeEnd('deep-equal');

console.time('fast-deep-equal');
const fastdeep = require('fast-deep-equal');
console.timeEnd('fast-deep-equal');

console.time('lodash/isequal');
const lodash = require('lodash/isequal');
console.timeEnd('lodash/isequal');

console.time('nano-equal');
const nanoequal = require('nano-equal');
console.timeEnd('nano-equal');

console.time('dequal');
const { dequal } = require('dequal');
console.timeEnd('dequal');

console.time('dequal/lite');
const lite = require('dequal/lite');
console.timeEnd('dequal/lite');

function naiive(a, b) {
	try {
		deepStrictEqual(a, b);
		return true;
	} catch (err) {
		return false;
	}
}

// @ts-ignore
const assert = (foo, bar, msg='') => deepStrictEqual(foo, bar, msg);

function runner(name, contenders) {
	const file = join(__dirname, 'fixtures', name + '.js');
	const fixture = require(file);

	console.log('\n(%s) Validation: ', name);
	Object.keys(contenders).forEach(name => {
		const func = contenders[name];
		const { foo, bar } = klona(fixture);

		try {
			assert(func(1, 1), true, 'equal numbers');
			assert(func(1, 2), false, 'not equal numbers');
			assert(func(1, [1]), false, 'number vs array');
			assert(func(0, null), false, 'number vs null');
			assert(func(0, undefined), false, 'number vs undefined');

			assert(func(foo, bar), true, 'kitchen sink');
			console.log('  ✔', name);
		} catch (err) {
			console.log('  ✘', name, `(FAILED @ "${err.message}")`);
		}
	});

	console.log('\n(%s) Benchmark: ', name);
	const bench = new Suite().on('cycle', e => {
		console.log('  ' + e.target);
	});

	Object.keys(contenders).forEach(name => {
		const { foo, bar } = klona(fixture);
		bench.add(name + ' '.repeat(22 - name.length), () => {
			// contenders[name]({ a: 1, b: 2, c: 3 }, { a: 1, b: 4, c: 3 });
			contenders[name](foo, bar);
		})
	});

	bench.run();
}

runner('basic', {
	'assert.deepStrictEqual': naiive,
	'util.isDeepStrictEqual': isDeepStrictEqual,
	'deep-equal': deepEqual,
	'fast-deep-equal': fastdeep,
	'lodash.isEqual': lodash,
	'nano-equal': nanoequal,
	'dequal/lite': lite.dequal,
	'dequal': dequal,
});

// Only keep those that pass
runner('complex', {
	'assert.deepStrictEqual': naiive,
	'util.isDeepStrictEqual': isDeepStrictEqual,
	'deep-equal': deepEqual,
	'lodash.isEqual': lodash,
	'dequal': dequal,
});
