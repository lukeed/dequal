var has = Object.prototype.hasOwnProperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

export function dequal(foo, bar) {
	var ctor, len, tmp;
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
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			var fobj = [], bobj = [];
			// Native Map identity/SameValueZero handles source primitive and
			// function keys. Presence is checked before reading undefined values.
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					fobj.push(len);
				} else if (!bar.has(tmp) || !dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			if (!fobj.length) return true;
			for (len of bar) {
				tmp = len[0];
				if ((tmp && typeof tmp === 'object') || !foo.has(tmp)) bobj.push(len);
			}
			if (fobj.length !== bobj.length) return false;

			// Match object-key entries as a bipartite graph.  Kuhn's augmenting
			// paths avoid the order-dependent failure of greedy pair selection,
			// while the iterative queue keeps long chains off the call stack.
			var matching = [], sourceMatch = [], seenSource = [], seenTarget = [], previous = [], queue, head, tail, mark=0, src, tar, old;
			for (len=0; len<bobj.length; len++) matching[len] = -1;
			for (len=0; len<fobj.length; len++) {
				mark++;
				tar = -2;
				queue = []; head = 0; tail = 1; queue[0] = len;
				seenSource[len] = mark;
				while (head < tail) {
					src = queue[head++];
					for (ctor=0; ctor<bobj.length; ctor++) {
						if (seenTarget[ctor] === mark || !dequal(bobj[ctor][0], fobj[src][0]) || !dequal(fobj[src][1], bobj[ctor][1])) continue;
						seenTarget[ctor] = mark;
						previous[ctor] = src;
						if (matching[ctor] < 0) {
							tar = ctor;
							while (tar >= 0) {
								src = previous[tar];
								old = sourceMatch[src];
								matching[tar] = src;
								sourceMatch[src] = tar;
								tar = old === undefined ? -1 : old;
							}
							break;
						}
						if (seenSource[matching[ctor]] !== mark) {
							seenSource[matching[ctor]] = mark;
							queue[tail++] = matching[ctor];
						}
					}
					if (tar === -1) break;
				}
				if (tar !== -1) return false;
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
