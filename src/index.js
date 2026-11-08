var has = Object.prototype.hasOwnProperty;

export function dequal(foo, bar) {
	var ctor, len, tmp, matches;
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

		if (ctor === Set) {
			if (foo.size !== bar.size) {
				return false;
			}
			matches = new Set();
			outer: for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					if (bar.has(tmp) && !matches.has(tmp)) {
						matches.add(tmp);
						continue;
					}
					for (ctor of bar) {
						if (!matches.has(ctor) && dequal(tmp, ctor)) {
							matches.add(ctor);
							continue outer;
						}
					}
					return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			matches = new Set();
			outer: for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					if (bar.has(tmp) && !matches.has(tmp) && dequal(len[1], bar.get(tmp))) {
						matches.add(tmp);
						continue;
					}
					for (ctor of bar) {
						if (!matches.has(ctor[0]) && dequal(tmp, ctor[0]) && dequal(len[1], ctor[1])) {
							matches.add(ctor[0]);
							continue outer;
						}
					}
					return false;
				}
				if (!bar.has(tmp) || !dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo.getInt8(len) === bar.getInt8(len));
			}
			return len === -1;
		}

		if (ArrayBuffer.isView(foo)) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
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
