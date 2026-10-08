var has = Object.prototype.hasOwnProperty;

function primitive(ctor, obj) {
	try {
		return ctor.prototype.valueOf.call(obj);
	} catch (err) {
		return obj;
	}
}

export function dequal(foo, bar) {
	var ctor, len, tmp, val;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			if (ctor === Number || ctor === String || ctor === Boolean
				|| (typeof Symbol === 'function' && ctor === Symbol)
				|| (typeof BigInt === 'function' && ctor === BigInt)) {
				if (typeof bar !== 'object') return false;
				tmp = primitive(ctor, foo);
				val = primitive(ctor, bar);
				if ((tmp !== foo || val !== bar) && (tmp === foo || val === bar || !dequal(tmp, val))) return false;
			}
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}
