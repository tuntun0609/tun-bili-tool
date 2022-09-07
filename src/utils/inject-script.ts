export const injectScript = (file: string, node: string) => {
	const th = document.querySelector(node);
	const s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	th.appendChild(s);
};
