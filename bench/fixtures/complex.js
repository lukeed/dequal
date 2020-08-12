exports.foo = {
	foo: 'value1',
	bar: new Set([1, 2, 3]),
	baz: /foo/i,
	bat: {
		hello: new Map([ ['hello', 'world'] ]),
		world: {
			aaa: new Map([
				[{ foo: /bar/ }, 'sub sub value1'],
			]),
			bbb: [1, 2, { prop2:1, prop:2 }, 4, 5]
		}
	},
	quz: new Set([{ a:1 , b:2 }]),
	qut: new Date(2016, 2, 10),
	qar: new Uint8Array([1, 2, 3, 4, 5]),
}

exports.bar = {
	quz: new Set([{ a:1 , b:2 }]),
	baz: /foo/i,
	foo: 'value1',
	bar: new Set([1, 2, 3]),
	qar: new Uint8Array([1, 2, 3, 4, 5]),
	qut: new Date('2016/03/10'),
	bat: {
		world: {
			aaa: new Map([
				[{ foo: /bar/ }, 'sub sub value1'],
			]),
			bbb: [1, 2, { prop2:1, prop:2 }, 4, 5]
		},
		hello: new Map([ ['hello', 'world'] ])
	}
};
