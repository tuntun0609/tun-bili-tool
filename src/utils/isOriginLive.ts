// 是否是原版直播间
export const isOriginLive = () => {
	if(document.querySelector('article[id="app"]') || location.pathname === '/p/html/live-web-mng/index.html') {
		return false;
	}
	return true;
};
