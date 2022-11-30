import { API } from './utils';
import { Storage } from '@plasmohq/storage';

export { };

const storage = new Storage();

// 直播状态
const liveStatus = {};

// member
let listenLiveRooms = [];

// 监听事件任务id
let listenId: string | number | NodeJS.Timer;

// 监听member开播(新)
const listenLiveRoomStatus = async (info: any) => {
	if (info) {
		const { key } = listenLiveRooms.find(item => item.roomid === info.room_id);
		// 如果监控列表无此项，则添加并设置值为false
		if (liveStatus[key] === undefined) {
			liveStatus[key] = false;
		}
		// 如果正在开播
		if (info.live_status === 1) {
			// 判断是否为第一次监测到
			// 如果是第一次就提醒并且将对应liveStatus改为true
			if (!liveStatus[key]) {
				// 发送推送提示
				const notifyOptions: chrome.notifications.NotificationOptions<true> = {
					type: 'image',
					title: `${info.uname} 开播啦`,
					iconUrl: info.face,
					imageUrl: info.cover_from_user,
					message: info.title,
				};
				chrome.notifications.create(`${key}-${info.room_id}-${(new Date()).getTime()}`, notifyOptions);
				// 修改liveStatus
				liveStatus[key] = !liveStatus[key];
			}
		} else {
			// 如果不在开播并且状态还是true就修改为false
			if (liveStatus[key]) {
				liveStatus[key] = false;
			}
		}
	}
};

// 监听进程(新)
const listenLiveRoomMain = async (time = 30000) => {
	console.log('开始监听直播间');
	const listenLiveRoomStatusId = setInterval(async () => {
		const midArr = listenLiveRooms.map(member => (member.key));
		try {
			const info = await API.getStatusZInfoByUids(midArr);
			if (info?.msg !== undefined && info?.msg === 'fail') {
				// 该接口不稳定，所以不用console.error
				console.log('getStatusZInfoByUids请求失败');
				return;
			}
			for (const key in info) {
				if (Object.hasOwnProperty.call(info, key)) {
					const item = info[key];
					listenLiveRoomStatus(item);
				}
			}
			// console.log(liveStatus);
		} catch (error) {
			console.error('getStatusZInfoByUids请求失败', error);
		}
	}, time);
	// 返回监听任务id，方便用户自定义销毁
	return listenLiveRoomStatusId;
};

// 停止监听直播间
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const closeSetInterval = (id: string | number | NodeJS.Timeout) => {
	clearInterval(id);
	console.log('停止监听直播间');
};

// 当提示信息被点击时
chrome.notifications.onClicked.addListener((e) => {
	const [ , roomid] = e.split('-');
	const createProperties = {
		url: `https://live.bilibili.com/${roomid}`,
	};
	chrome.tabs.create(createProperties);
});

// 新安装或者重刷新插件
chrome.runtime.onInstalled.addListener(async (_details) => {
	const isListenLiveRoom = await storage.get('isListenLiveRoom');
	if (isListenLiveRoom) {
		listenId = await listenLiveRoomMain();
	}

	listenLiveRooms = await storage.get('listenLiveRooms') ?? [];

	console.log(listenLiveRooms);
	// popup页面 快速导航页面默认数据
	if (await storage.get('quickNavigationData') === undefined) {
		storage.set('quickNavigationData', [
			{
				name: '番剧',
				url: 'https://www.bilibili.com/anime',
			},
			{
				name: '动态首页',
				url: 'https://t.bilibili.com/',
			},
			{
				name: '开发者bb空间',
				url: 'https://space.bilibili.com/47706697',
			},
		]);
	}

	// 右键搜索
	chrome.contextMenus.create({
		id: 'bilibili',
		title: '使用bilibili搜索',
		type: 'normal',
		contexts: ['selection'],
	});
	chrome.contextMenus.onClicked.addListener((info) => {
		if (info.menuItemId === 'bilibili') {
			chrome.tabs.create({url: `https://search.bilibili.com/all?keyword=${info.selectionText}`});
		}
	});
});

// 监听storage
storage.watch({
	'listenLiveRooms': (data) => {
		console.log(data.newValue);
		listenLiveRooms = data.newValue;
	},
});

storage.watch({
	'isListenLiveRoom': async (data) => {
		if (data.newValue) {
			listenId = await listenLiveRoomMain();
		} else {
			closeSetInterval(listenId);
		}
	},
});

// 接收各页面事件并处理
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	setTimeout(async () => {
		if (request.type === 'getShortUrl') {
			const data = await API.getShortUrl(request.url);
			sendResponse({
				content: data.content || '',
			});
		}
	}, 0);
	return true;
});
