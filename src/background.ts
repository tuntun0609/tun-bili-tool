import { defaultMembersInfo, API } from './utils';
export { };

// 直播状态
const liveStatus = {};

// member
const membersInfo = defaultMembersInfo;

// 监听事件任务id
// let listenId: Promise<NodeJS.Timer>;

// 监听member开播(新)
const listenLiveRoomStatus = async (info) => {
	if (info) {
		// 获取英文名
		const {name} = membersInfo.find(item => item.roomId === info.room_id);
		// 如果监控列表无此项，则添加并设置值为false
		if (liveStatus[name] === undefined) {
			liveStatus[name] = false;
		}
		// 如果正在开播
		if (info.live_status === 1) {
			// 判断是否为第一次监测到
			// 如果是第一次就提醒并且将对应liveStatus改为true
			if (!liveStatus[name]) {
				// 发送推送提示
				const notifyOptions: chrome.notifications.NotificationOptions<true> = {
					type: 'image',
					title: `${info.uname} 开播啦`,
					iconUrl: info.face,
					imageUrl: info.cover_from_user,
					message: info.title,
				};
				chrome.notifications.create(`${name}-${(new Date()).getTime()}`, notifyOptions);
				// 修改liveStatus
				liveStatus[name] = !liveStatus[name];
			}
		} else {
			// 如果不在开播并且状态还是true就修改为false
			if (liveStatus[name]) {
				liveStatus[name] = false;
			}
		}
	}
};

// 监听进程(新)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listenLiveRoomMain = async (time = 30000) => {
	console.log('开始监听直播间');
	const listenLiveRoomStatusId = setInterval(async () => {
		const midArr = membersInfo.map(member => (member.mid));
		const info = await API.getStatusZInfoByUids(midArr);
		console.log(info);
		if (info.msg !== undefined && info.msg === 'fail') {
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
	}, time);
	// 返回监听任务id，方便用户自定义销毁
	return listenLiveRoomStatusId;
};

// 停止监听直播间
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const closeSetInterval = (id) => {
	clearInterval(id);
	console.log('停止监听直播间');
};

// 当提示信息被点击时
// chrome.notifications.onClicked.addListener((e) => {
//   let name = e.split('-')[0];
//   let roomId = membersInfo.find((item) => {
//     return item.name === name;
//   }).roomId;
//   let createProperties = {
//     url: `https://live.bilibili.com/${roomId}`,
//   };
//   chrome.tabs.create(createProperties);
// })

// 新安装或者重刷新插件
chrome.runtime.onInstalled.addListener((_details) => {
	// chrome.storage.local.get(['isListenLiveStatus'], (result) => {
	//   if (result.isListenLiveStatus) {
	//     listenId = listenLiveRoomMain();
	//   }
	// });
	// chrome.storage.local.set({
	//   membersInfo: defaultMembersInfo,
	// })
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
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     if (key === 'isListenLiveStatus') {
//       if (newValue) {
//         listenId = listenLiveRoomMain();
//       } else {
//         // 关闭监听
//         closeSetInterval(listenId);
//         // 直播状态全为false
//         Object.keys(liveStatus).forEach((key) => {
//           liveStatus[key] = false;
//         })
//       }
//     }
//     if (key === 'membersInfo') {
//       membersInfo = newValue;
//     }
//   }
// });

// 接收各页面事件并处理
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	setTimeout(async () => {
		if (request.type === 'getShortUrl') {
			const data = await API.getShortUrl(request.url);
			sendResponse({
				content: data.content || '',
			});
		}
		if (request.type === 'getDataFromStorage') {
			chrome.storage.local.get([...request.keys], (result) => {
				sendResponse({
					...result,
				});
			});
		}
		if (request.type === 'getLiveStatus') {
			sendResponse({
				liveStatus: liveStatus,
			});
		}
	}, 0);
	return true;
});
