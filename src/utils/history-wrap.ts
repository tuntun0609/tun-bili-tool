export {};
const _historyWrap = function (type) {
	const orig = history[type];
	const e = new Event(type);
	return function (...args: any) {
		const rv = orig.apply(this, args);
		window.dispatchEvent(e);
		return rv;
	};
};
history.pushState = _historyWrap('pushState');
history.replaceState = _historyWrap('replaceState');
