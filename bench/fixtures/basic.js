exports.foo = {
	prop1: 'value1',
	prop2: 'value2',
	prop3: 'value3',
	prop4: {
		subProp1: 'sub value1',
		subProp2: {
			subSubProp1: 'sub sub value1',
			subSubProp2: [1, 2, { prop2:1, prop:2 }, 4, 5]
		}
	},
	prop5: 1000,
	prop6: new Date(2016, 2, 10)
}

exports.bar = {
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
};
