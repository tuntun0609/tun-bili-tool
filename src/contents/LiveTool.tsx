import type { PlasmoContentScript } from 'plasmo';
import React, {
	MouseEventHandler,
	useEffect, useMemo, useState,
} from 'react';
import { Storage, useStorage } from '@plasmohq/storage';
// import axios from 'axios';
// import { isUndefined } from 'lodash';
import { ConfigProvider, Popover, Space } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

import toolCss from 'data-text:./LiveTool.scss';
import antdCss from 'data-text:antd/dist/antd.variable.min.css';
import zhCN from 'antd/es/locale/zh_CN';
import type { TooltipPlacement } from 'antd/lib/tooltip';

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
	matches: ['*://live.bilibili.com/*'],
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

// tool 弹出层
const ToolPopup = () => (
	<div className='tun-popup-main'>
		<Space style={{ width: '100%' }} direction="vertical">
			LiveTool
		</Space>
	</div>
);

// tool main
const LiveTool = () => {
	const TOOL_SIZE = 36;
	const [isTool] = useStorage('isLiveTool', false);
	const [position, setPosition] = useState({ top: -TOOL_SIZE, right: -TOOL_SIZE });
	const [top, setTop] = useState(-TOOL_SIZE);
	const [right, setRight] = useState(-TOOL_SIZE);
	const [popupShow, setPopupShow] = useState(false);

	const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const main = async () => {
			const position = await storage.get<{ top: number, right: number }>('liveToolPosition');
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
		storage.set('liveToolPosition', { top, right });
	};
	window.onmouseup = () => {
		window.onmousemove = null;
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
				content={ToolPopup}
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

export default LiveTool;
