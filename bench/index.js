const { Suite } = require('benchmark');

console.log('Load times:');

console.time('assert');
const { deepStrictEqual } = require('assert');
console.timeEnd('assert');

console.time('util');
const { isDeepStrictEqual } = require('util');
console.timeEnd('util');

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


function naiive(a, b) {
	try {
		deepStrictEqual(a, b);
		return true;
	} catch (err) {
		return false;
	}
}

const contenders = {
	'assert.deepStrictEqual': naiive,
	'util.isDeepStrictEqual': isDeepStrictEqual,
	'fast-deep-equal': fastdeep,
	'lodash.isEqual': lodash,
	'nano-equal': nanoequal,
	'dequal': dequal,
};

console.log('\nValidation: ');
Object.keys(contenders).forEach(name => {
	const func = contenders[name];

	try {
		deepStrictEqual(func(1, 1), true, 'equal numbers');
		deepStrictEqual(func(1, 2), false, 'not equal numbers');
		deepStrictEqual(func(1, [1]), false, 'number vs array');
		deepStrictEqual(func(0, null), false, 'number vs null');
		deepStrictEqual(func(0, undefined), false, 'number vs undefined');

		deepStrictEqual(
			func({
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
			}),
			true,
			'kitchen sink'
		)

		console.log('  ✔', name);
	} catch (err) {
		console.log('  ✘', name, `(FAILED @ "${err.message}")`);
	}
});


console.log('\nBenchmark:');
const bench = new Suite().on('cycle', e => {
	console.log('  ' + e.target);
});

Object.keys(contenders).forEach(name => {
	bench.add(name + ' '.repeat(22 - name.length), () => {
		// contenders[name]({ a: 1, b: 2, c: 3 }, { a: 1, b: 4, c: 3 });
		contenders[name]({
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
	})
});

bench.run();
