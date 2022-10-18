// 是否是原版直播间

const originLiveRoomReg = /\/(blanc\/)?(\d+)/;

export const isOriginLive = () => {
	if (
		!document.querySelector('article[id="app"]') &&
		(originLiveRoomReg.test(location.pathname))
	) {
		return true;
	}
	return false;
};
