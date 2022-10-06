import React, {
	MouseEventHandler, useEffect, useMemo, useState,
} from 'react';
import type { PlasmoContentScript } from 'plasmo';
import { Storage, useStorage } from '@plasmohq/storage';
import { ToolOutlined } from '@ant-design/icons';
import type { TooltipPlacement } from 'antd/lib/tooltip';
import {
	Popover, message, ConfigProvider,
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import { VideoToolPopup } from '../contents-components';

import toolCss from 'data-text:./VideoTool.scss';
// import antdCss from 'data-text:antd/dist/antd.css';
import antdCss from 'data-text:antd/dist/antd.variable.min.css';

ConfigProvider.config({
	theme: {
		primaryColor: '#fb7299',
		successColor: '#52c41a',
		warningColor: '#faad14',
		errorColor: '#f5222d',
	},
});

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/video/*'],
};

// 获取挂载节点
export const getMountPoint = async () => document.querySelector('body');

// 注入style
export const getStyle = () => {
	const style = document.createElement('style');
	style.textContent = toolCss + antdCss;
	return style;
};

// shadow节点id名
export const getShadowHostId = () => 'tun-tool-popup';

// 全局message配置
message.config({
	top: 70,
	duration: 1.5,
	maxCount: 3,
	getContainer: () => document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container'),
});

// tool main
const VideoTool = () => {
	const TOOL_SIZE = 36;
	const [isTool] = useStorage('isVideoTool', false);
	const [position, setPosition] = useState({ top: -TOOL_SIZE, right: -TOOL_SIZE });
	const [top, setTop] = useState(-TOOL_SIZE);
	const [right, setRight] = useState(-TOOL_SIZE);
	const [popupShow, setPopupShow] = useState(false);

	const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const main = async () => {
			const position = await storage.get<{ top: number, right: number }>('videoToolPosition');
			if (position) {
				setPosition(position);
			} else {
				setPosition({ top: 100, right: 100 });
			}
		};
		main();
	}, []);

	useEffect(() => {
		setTop(position.top);
		setRight(position.right);
	}, [position]);

	const getY = (y: number) => {
		if (y < 0) {
			return 0;
		} else if (y > document.documentElement.clientHeight - TOOL_SIZE) {
			return document.documentElement.clientHeight - TOOL_SIZE;
		}
		return y;
	};
	const getX = (x: number) => {
		if (x < 0) {
			return 0;
		} else if (x > document.documentElement.clientWidth - TOOL_SIZE) {
			return document.documentElement.clientWidth - TOOL_SIZE;
		}
		return x;
	};

	const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
		setStartPosition({ x: e.clientX, y: e.clientY });
		const offsetX = document.documentElement.clientWidth - e.pageX - right;
		const offsetY = e.clientY - top;
		window.onmousemove = (mousemoveEvent: MouseEvent) => {
			mousemoveEvent.preventDefault();
			setTop(getY(mousemoveEvent.clientY - offsetY));
			setRight(getX(document.documentElement.clientWidth - mousemoveEvent.pageX - offsetX));
		};
	};
	const onMouseUp: MouseEventHandler<HTMLDivElement> = async () => {
		window.onmousemove = null;
		storage.set('videoToolPosition', { top, right });
	};
	const isDrag = (sx: number, sy: number, ex: number, ey: number) => {
		const dragRange = 5;
		if(Math.sqrt((sx - ex) * (sx - ex) + (sy - ey) * (sy - ey)) <= dragRange) {
			return false;
		}
		return true;
	};
	const onToolClick: MouseEventHandler<HTMLDivElement> = (e) => {
		if (!isDrag(startPosition.x, startPosition.y, e.clientX, e.clientY)) {
			setPopupShow(!popupShow);
		}
	};
	const popupPlacement = useMemo<TooltipPlacement>(() => `${document.documentElement.clientWidth - right - TOOL_SIZE > 350 ? 'left' : 'right'}${document.documentElement.clientHeight - top > 530 ? 'Top' : 'Bottom'}`, [top, right]);
	return isTool ? (
		<ConfigProvider locale={zhCN}>
			<Popover
				content={VideoToolPopup}
				open={popupShow}
				placement={popupPlacement}
				getPopupContainer={() => document.querySelector('#tun-tool-popup').shadowRoot.querySelector('.tun-tool-main') as HTMLElement}
			>
				<div
					className='tun-tool-main'
					onMouseDown={onMouseDown}
					onMouseUp={onMouseUp}
					style={{
						top: top + 'px',
						right: right + 'px',
					}}
				>
					<div className='icon-main'
						onClick={onToolClick}
					>
						<ToolOutlined className='icon' />
					</div>
				</div>
			</Popover>
		</ ConfigProvider>
	) : null;
};

export default VideoTool;
