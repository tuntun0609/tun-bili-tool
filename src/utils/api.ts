
const TRUE_STATUS = 200;
// 封装get方法
export const get = async (props: { url: any; params?: any; options?: any; }) => {
	const { url: baseUrl, params = {}, options = {} } = props;
	const pStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
	const url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
	const res = await fetch(url, {
		credentials: 'include',
		...options,
	});
	if (res.status === TRUE_STATUS) {
		const data = await res.json();
		if (data.msg !== 'invalid params') {
			return (data);
		}
		return {
			data: {
				msg: 'fail',
			},
		};
	}
	return {
		data: {
			msg: 'fail',
		},
	};
};
export const post = async (props: { url: any; params: any; options?: any; }) => {
	const { url, params = {}, options = {} } = props;
	const res = await fetch(url, {
		method: 'post',
		body: JSON.stringify({
			...params,
		}),
		...options,
	});
	if (res.status === TRUE_STATUS) {
		return (await res.json());
	}
	return {
		data: {
			msg: 'fail',
		},
	};
};
// 通过关键词获取直播列表
export const getLiver = async (num = 0) => {
	try {
		let params = {};
		if (num !== 0) {
			params = {
				size: num,
			};
		}
		const res = await get({
			url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users',
			params,
		});
		return res.data;
	} catch (error) {
		console.log('getLiver', error);
	}
};
// 获取用户卡片信息
export const getCard = async (mid) => {
	try {
		const res = await get({
			url: 'https://api.bilibili.com/x/web-interface/card',
			params: {
				mid,
				photo: 'true',
			},
		});
		return res.data;
	} catch (error) {
		console.log('getCard', error);
	}
};
// 通过房间号获取直播间状态
export const getRoomInfo = async (roomId) => {
	try {
		const res = await get({
			url: 'https://api.live.bilibili.com/room/v1/Room/get_info',
			params: {
				id: roomId,
			},
		});
		return res.data;
	} catch (error) {
		console.log('getRoomInfo', error);
	}
};
// 通过uid获取用户信息
export const getUserInfo = async (mid) => {
	try {
		const res = await get({
			url: 'https://api.bilibili.com/x/space/acc/info',
			params: {
				mid: mid,
			},
		});
		return res.data;
	} catch (error) {
		console.log('getUserInfo', error);
	}
};
// 通过mid批量获取主播直播状态
export const getStatusZInfoByUids = async (midArr) => {
	try {
		const res = await post({
			url: 'https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids',
			params: {
				uids: midArr,
			},
			options: {
				headers: {
					'Content-Type': 'application/json',
				},
			},
		});
		return res.data;
	} catch (error) {
		console.log('getStatusZInfoByUids', error);
	}
};
export const getVideoInfo = async (bvId: string) => {
	const baseUrl = 'https://api.bilibili.com/x/web-interface/view';
	const paramsData = {
		bvid: bvId,
	};
	try {
		const res = await get({
			url: baseUrl,
			params: {
				...paramsData,
			},
			options: {
				credentials: 'omit',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		});
		return res.data;
	} catch (error) {
		console.log('getVideoInfo', error);
	}
};
// 通过视频地址获取短链
export const getShortUrl = async (url) => {
	const baseUrl = 'https://api.bilibili.com/x/share/click';
	const paramsData = {
		build: 6180000,
		buvid: 'test',
		oid: url,
		platform: 'android',
		share_channel: 'COPY',
		share_id: 'public.webview.0.0.pv',
		share_mode: 3,
	};
	try {
		const res = await post({
			url: baseUrl,
			params: {
				...paramsData,
			},
			options: {
				credentials: 'omit',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		});
		return res.data;
	} catch (error) {
		console.error('getShortUrl', error);
	}
};
// 获取推荐视频
export const getRecommendVideo = async (page: number) => {
	const baseUrl = 'https://api.bilibili.com/x/web-interface/index/top/feed/rcmd';
	const paramsData = {
		y_num: 4,
		fresh_type: 3,
		feed_version: 'V4',
		fresh_idx_1h: page + 1,
		fetch_row: 1,
		fresh_idx: page + 1,
		brush: page,
		homepage_ver: 1,
		ps: 11,
	};
	const res = await get({
		url: baseUrl,
		params: {
			...paramsData,
		},
		options: {
			// credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	});
	return res;
};
export const getDynVideo = async (page: number, offset: string) => {
	const baseUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all';
	const paramsData = {
		timezone_offset: -480,
		type: 'video',
		page: page,
		offset: offset !== undefined ? offset : '',
	};
	const res = await get({
		url: baseUrl,
		params: {
			...paramsData,
		},
	});
	return res;
};
export const getVideoShot = async (bvid: string) => {
	const baseUrl = 'https://api.bilibili.com/x/player/videoshot';
	const paramsData = {
		index: 1,
		bvid: bvid,
	};
	const res = await get({
		url: baseUrl,
		params: {
			...paramsData,
		},
	});
	return res;
};
export const getLiveInfo = async (roomid: number) => {
	const baseUrl = 'https://api.live.bilibili.com/room/v1/Room/get_info';
	const paramsData = {
		room_id: roomid,
	};
	const res = await get({
		url: baseUrl,
		params: {
			...paramsData,
		},
	});
	return res;
};

export const getOnlineGoldRank = async (props: { ruid: number; roomId: number; page: number; pageSize: number; }) => {
	const { ruid, roomId, page, pageSize } = props;
	const baseUrl = 'https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank';
	const paramsData = {
		ruid,
		roomId,
		page,
		pageSize,
	};
	const res = await get({
		url: baseUrl,
		params: {
			...paramsData,
		},
	});
	return res;
};
