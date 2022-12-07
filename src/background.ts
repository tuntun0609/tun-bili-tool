import { API, log } from './utils';
import { Storage } from '@plasmohq/storage';

export { };

const storage = new Storage();

// 监听事件任务id
const listenLiveRoomName = 'listenLiveRooms';

// 监听member开播(新)
const listenLiveRoomStatus = async (info: any, rooms: any[], liveStatus: { [x: string]: boolean; }) => {
	if (info) {
		const { key } = rooms.find(item => item.roomid === info.room_id);
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

const listenLiveRoomMain = async () => {
	const listenLiveRooms: any[] = await storage.get('listenLiveRooms') ?? [];
	const midArr = listenLiveRooms.map(member => (member.key));
	log(midArr, new Date());
	try {
		if (midArr?.length !== 0) {
			const info = await API.getStatusZInfoByUids(midArr);
			log(info);
			if (info?.msg !== 'success') {
				// 该接口不稳定，所以不用console.error
				console.log('getStatusZInfoByUids请求失败');
				return;
			}
			const { data } = info;
			const liveStatus = await storage.get('liveStatus') ?? {};
			for (const key in data) {
				if (Object.hasOwnProperty.call(data, key)) {
					const item = data[key];
					listenLiveRoomStatus(item, listenLiveRooms, liveStatus);
				}
			}
			log(liveStatus);
			await storage.set('liveStatus', liveStatus);
		}
	} catch (error) {
		console.error('getStatusZInfoByUids请求失败', error);
	}
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name === listenLiveRoomName) {
		listenLiveRoomMain();
	}
});

// 监听进程(新)
const listenLiveRoom = async (time = 1) => {
	console.log('开始监听直播间');
	chrome.alarms.create(listenLiveRoomName, { periodInMinutes: time });
};

// 停止监听直播间
const closeAlarm = (name: string) => {
	chrome.alarms.clear(
		name,
		() => {
			console.log('停止监听直播间');
			storage.set('liveStatus', {});
		},
	);
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
	// 是否默认启动监听
	const isListenLiveRoom = await storage.get('isListenLiveRoom');
	if (isListenLiveRoom) {
		listenLiveRoom();
	}

	// 重置直播状态
	storage.set('liveStatus', {});

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
});

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

// 监听直播监听开启状态
storage.watch({
	'isListenLiveRoom': async (data) => {
		if (data.newValue) {
			listenLiveRoom();
		} else {
			closeAlarm(listenLiveRoomName);
		}
	},
});

// 接收各页面事件并处理
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	(async () => {
		if (request.type === 'getShortUrl') {
			const data = await API.getShortUrl(request.url);
			sendResponse({
				content: data?.content ?? '',
			});
		}
	})();
	return true;
});
