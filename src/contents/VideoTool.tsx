import type { PlasmoContentScript } from 'plasmo';
import React, {
	MouseEventHandler,
	useEffect, useMemo, useState,
} from 'react';
import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';
import { ToolOutlined } from '@ant-design/icons';
import { StyleProvider } from '@ant-design/cssinjs';
import type { TooltipPlacement } from 'antd/lib/tooltip';

import { VideoToolPopup, ErrorBoundary, ThemeProvider } from '../contents-components';
import { TOOL_ID } from '~utils';

import toolCss from 'data-text:./VideoTool.scss';
import antdResetCssText from 'data-text:antd/dist/reset.css';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/video/*'],
};

// 注入style
export const getStyle = () => {
	const style = document.createElement('style');
	style.textContent = toolCss + antdResetCssText;
	return style;
};

// shadow节点id名
export const getShadowHostId = () => TOOL_ID;

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
		e.preventDefault();
		setStartPosition({ x: e.clientX, y: e.clientY });
		const offsetX = document.documentElement.clientWidth - e.pageX - right;
		const offsetY = e.clientY - top;
		window.onmousemove = (mousemoveEvent: MouseEvent) => {
			mousemoveEvent.preventDefault();
			setTop(getY(mousemoveEvent.clientY - offsetY));
			setRight(getX(document.documentElement.clientWidth - mousemoveEvent.pageX - offsetX));
		};
	};
	const onMouseUp: MouseEventHandler<HTMLDivElement> = async (e) => {
		e.preventDefault();
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
		<ThemeProvider>
			<StyleProvider container={document.querySelector(`#${TOOL_ID}`).shadowRoot}>
				<ErrorBoundary>
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
						<div style={{
							position: 'absolute',
							top: '0px',
							left: '0px',
							width: '100%',
						}}>
							<div
								className={`${popupPlacement} ${popupShow ? 'popup-content-show' : 'popup-content-hide'} popup-content`}
								style={{
									backgroundColor: '#fff',
									width: '330px',
									padding: '10px 15px',
									borderRadius: '8px',
									position: 'absolute',
								}}
								onMouseDown={e => e.stopPropagation()}
							>
								<VideoToolPopup></VideoToolPopup>
							</div>
						</div>
					</div>
				</ErrorBoundary>
			</StyleProvider>
		</ ThemeProvider>
	) : null;
};

export default VideoTool;
