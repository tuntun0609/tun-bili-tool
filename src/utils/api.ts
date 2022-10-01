export const API = {
	TRUE_STATUS: 200,
	// 封装get方法
	get: async (props) => {
		const { url: baseUrl, params = {}, option = {} } = props;
		const pStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
		const url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
		const res = await fetch(url, {
			credentials: 'include',
			...option,
		});
		if (res.status === API.TRUE_STATUS) {
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
	},
	post: async (props) => {
		const { url, params = {}, headers = {}, option = {} } = props;
		const res = await fetch(url, {
			method: 'post',
			headers: {
				...headers,
			},
			body: JSON.stringify({
				...params,
			}),
			...option,
		});
		if (res.status === API.TRUE_STATUS) {
			return (await res.json());
		}
		return {
			data: {
				msg: 'fail',
			},
		};
	},
	// 通过关键词获取直播列表
	getLiver: async (num = 0) => {
		try {
			let params = {};
			if (num !== 0) {
				params = {
					size: num,
				};
			}
			const res = await API.get({
				url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users',
				params,
			});
			return res.data;
		} catch (error) {
			console.log('getLiver', error);
		}
	},
	// 获取用户卡片信息
	getCard: async (mid) => {
		try {
			const res = await API.get({
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
	},
	// 通过房间号获取直播间状态
	getRoomInfo: async (roomId) => {
		try {
			const res = await API.get({
				url: 'https://api.live.bilibili.com/room/v1/Room/get_info',
				params: {
					id: roomId,
				},
			});
			return res.data;
		} catch (error) {
			console.log('getRoomInfo', error);
		}
	},
	// 通过uid获取用户信息
	getUserInfo: async (mid) => {
		try {
			const res = await API.get({
				url: 'http://api.bilibili.com/x/space/acc/info',
				params: {
					mid: mid,
				},
			});
			return res.data;
		} catch (error) {
			console.log('getUserInfo', error);
		}
	},
	// 通过mid批量获取主播直播状态
	getStatusZInfoByUids: async (midArr) => {
		try {
			const res = await API.post({
				url: 'http://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids',
				params: {
					uids: midArr,
				},
				headers: {
					'Content-Type': 'application/json',
				},
			});
			return res.data;
		} catch (error) {
			console.log('getStatusZInfoByUids', error);
		}
	},
	getVideoInfo: async (bvId: string) => {
		const baseUrl = 'https://api.bilibili.com/x/web-interface/view';
		const paramsData = {
			bvid: bvId,
		};
		try {
			const res = await API.get({
				url: baseUrl,
				params: {
					...paramsData,
				},
				headers: {
					'Content-Type': 'application/json',
				},
				option: {
					credentials: 'omit',
				},
			});
			return res.data;
		} catch (error) {
			console.log('getVideoInfo', error);
		}
	},
	// 通过视频地址获取短链
	getShortUrl: async (url) => {
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
			const res = await API.post({
				url: baseUrl,
				params: {
					...paramsData,
				},
				headers: {
					'Content-Type': 'application/json',
				},
				option: {
					credentials: 'omit',
				},
			});
			return res.data;
		} catch (error) {
			console.log('getShortUrl', error);
		}
	},
	// 获取推荐视频
	getRecommendVideo: async (page: number) => {
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
		const res = await API.get({
			url: baseUrl,
			params: {
				...paramsData,
			},
			headers: {
				'Content-Type': 'application/json',
			},
			option: {
				credentials: 'omit',
			},
		});
		return res;
	},
};
