import { useEffect, useState } from 'react';
import { log } from '~utils';

export function useMutationObservable(targetEl: any, cb: any) {
	const [observer, setObserver] = useState(null);

	useEffect(() => {
		const obs = new MutationObserver(cb);
		setObserver(obs);
	}, [cb, setObserver]);

	useEffect(() => {
		if (!observer) return;
		if (targetEl) {
			observer.observe(targetEl, {
				childList: true,
			});
			log('开始监听');
		}
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [observer, targetEl]);
}
