// 227B – 128k op/s
export function v227(foo, bar) {
	var keys, ctor;
	return foo === bar || (
		foo && bar && (ctor=foo.constructor) === bar.constructor ?
			ctor === RegExp ? foo.toString() == bar.toString()
			: ctor === Date ? foo.getTime() == bar.getTime()
			: ctor === Array ?
				foo.length === bar.length && foo.every(function (val, idx) {
					return v227(val, bar[idx]);
				})
			: ctor === Object
				&& (keys=Object.keys(foo)).length === Object.keys(bar).length
				&& keys.every(function (k) {
					return k in bar && v227(foo[k], bar[k]);
				})
		: (foo !== foo && bar !== bar)
	);
}

// 255B – 155k op/s
export function v255(foo, bar) {
	var ctor, len, k;
	if (foo === bar) return true;
	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();
		if (ctor === Array && (len=foo.length) === bar.length) {
			while (len-- > 0 && v255(foo[len], bar[len]));
			return len === -1;
		}
		if (ctor === Object) {
			if (Object.keys(foo).length !== Object.keys(bar).length) return false;
			for (k in foo) {
				if (!(k in bar) || !v255(foo[k], bar[k])) return false;
			}
			return true;
		}
	}
	return foo !== foo && bar !== bar;
}

// 246B – 157k op/s
export function v246(foo, bar) {
	var ctor, i;
	if (foo === bar) return true;
	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();
		if (ctor === Array) {
			if (foo.length !== bar.length) return false;
			for (i=0; i < foo.length; i++) if (!v246(foo[i], bar[i])) return false;
			return true
		}
		if (ctor === Object) {
			if (Object.keys(foo).length !== Object.keys(bar).length) return false;
			for (i in foo) if (!(i in bar) || !v246(foo[i], bar[i])) return false;
			return true;
		}
	}
	return foo !== foo && bar !== bar;
}

// 225B - 97k op/s
export function v225(foo, bar) {
	var ctor, keys, len;
	if (foo === bar) return true;
	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();
		if (typeof foo === 'object') {
			if (Object.keys(foo).length !== Object.keys(bar).length) return false;
			for (len in foo) if (!(len in bar) || !v225(foo[len], bar[len])) return false;
			return true;
		}
	}
	return foo !== foo && bar !== bar;
}
