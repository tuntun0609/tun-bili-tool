import { isString, isNumber } from 'lodash';

// 大数转万
export const formatBigNumber = (num: number) => num > 10000 ? `${(num / 10000).toFixed(2)}万` : num;
// 字符串转DOM
export const s2d = (string: string) => new DOMParser().parseFromString(string, 'text/html').body.childNodes[0];
// 发布时间格式化
export const diffTime = (time: string | number) => {
	const upDate = new Date(typeof time === 'number' ? time * 1000 : parseInt(time, 10) * 1000);
	const nowDate = new Date();
	const nowTime = nowDate.getTime(),
		upTime = upDate.getTime(),
		Day = 24 * 60 * 60 * 1000,
		Hours = 60 * 60 * 1000,
		Minutes = 60 * 1000,
		diffDay = Math.floor((nowTime - upTime) / Day),
		diffHours = Math.floor((nowTime - upTime) / Hours),
		diffMinutes = Math.floor((nowTime - upTime) / Minutes);
	if(diffDay !== 0 && diffDay < 7) {
		if ( diffDay === 1 ) {
			return '昨天';
		}
		return diffDay + '天前';
	} else if(diffDay === 0 && diffHours !== 0) {
		return diffHours + '小时前';
	} else if(diffDay === 0 && diffHours === 0 && diffMinutes !== 0) {
		return diffMinutes + '分钟前';
	} else if (diffDay === 0 && diffHours === 0 && diffMinutes === 0) {
		return '刚刚';
	}

	const month = upDate.getMonth() + 1;
	const day = upDate.getDate();
	if (nowDate.getFullYear() !== upDate.getFullYear()) {
		return `${upDate.getFullYear()}-${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`;
	}
	return `${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`;
};
export const formatDuration = (s = 0) => {
	if (s < 0) s = -s;
	const time = [
		// Math.floor(s / 3600) % 24,
		Math.floor(s / 60) % 60,
		Math.floor(s) % 60,
	];
	return time.map(item => (
		item > 9 ? item : `0${item}`
	)).join(':');
};
// 判断发布时间与现在时间是否过长
export const isTimeTooLate = (time: number, rangeDay = 30) => {
	if (rangeDay === 0) {
		return false;
	}
	const upData = new Date(time * 1000);
	const nowTime = new Date().getTime(),
		upTime = upData.getTime(),
		Day = 24 * 60 * 60 * 1000,
		diffDay = (nowTime - upTime) / Day;
	if (diffDay > rangeDay) {
		return true;
	}
	return false;
};
// 通过图片网址或base64码将图片复制到剪贴板上
export const copyImg = (src = '') => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const img = new Image();
	img.crossOrigin = 'Anonymous';
	img.src = src;
	img.onload = () => {
		const nw = img.naturalWidth;
		const nh = img.naturalHeight;
		canvas.width = nw;
		canvas.height = nh;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(img, 0, 0);
		canvas.toBlob(async (blob) => {
			const data = [
				new window.ClipboardItem({
					[blob.type]: blob,
				}),
			];
			await copyDataToClipboard(data);
		});
	};
};
export const copyDataToClipboard = async (
	data: any,
) => {
	if (isString(data) || isNumber(data)) {
		return await navigator.clipboard.writeText(data.toString());
	}
	return await navigator.clipboard.write(data);
};

// 获取指定cookie值
export const getCookie = (cname: string) => {
	let res: string;
	const name = cname + '=';
	const ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		const c = ca[i].trim();
		if (c.indexOf(name) === 0) {
			res = c.substring(name.length, c.length);
		}
	}
	if (res) {
		return res;
	}
	throw new Error('获取cookie失败, 请登录后重试');
};

// 判断是否为纯数字字符串
export const isStrNumber = (data: string) => /^\d+$/.test(data);
