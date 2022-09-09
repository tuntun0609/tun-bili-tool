/* eslint-disable react/react-in-jsx-scope */
import { MouseEventHandler, useEffect, useState } from 'react';
import type { PlasmoContentScript } from 'plasmo';
import { Storage, useStorage } from '@plasmohq/storage';
import { ToolOutlined } from '@ant-design/icons';

import toolCss from 'data-text:./Tool.scss';
import antdCss from 'data-text:antd/dist/antd.css';
import toolPopupCss from 'data-text:../components/ToolPopup/ToolPopup.scss';
import { ToolPopup } from '~components';
import { Popover } from 'antd';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/video/*'],
};

export const getMountPoint = async () => document.querySelector('body');

export const getStyle = () => {
	const style = document.createElement('style');
	style.textContent = toolCss + antdCss + toolPopupCss;
	return style;
};

export const getShadowHostId = () => 'tun-tool-popup';

const Tool = () => {
	const TOOL_SIZE = 36;
	const [isTool] = useStorage('isTool', false);
	const [position, setPosition] = useState({ top: -TOOL_SIZE, right: -TOOL_SIZE });
	const [top, setTop] = useState(-TOOL_SIZE);
	const [right, setRight] = useState(-TOOL_SIZE);
	const [popupShow, setPopupShow] = useState(false);

	const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const main = async () => {
			const position = await storage.get<{ top: number, right: number }>('toolPosition');
			setPosition(position);
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
		} else if (y > document.body.offsetHeight - TOOL_SIZE) {
			return document.body.offsetHeight - TOOL_SIZE;
		}
		return y;
	};
	const getX = (x: number) => {
		if (x < 0) {
			return 0;
		} else if (x > document.body.offsetWidth - TOOL_SIZE) {
			return document.body.offsetWidth - TOOL_SIZE;
		}
		return x;
	};

	const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
		setStartPosition({ x: e.clientX, y: e.clientY });
		const offsetX = document.body.offsetWidth - e.pageX - right;
		const offsetY = e.clientY - top;
		window.onmousemove = (mousemoveEvent: MouseEvent) => {
			if (offsetX <= TOOL_SIZE && offsetY <= TOOL_SIZE) {
				mousemoveEvent.preventDefault();
				setTop(getY(mousemoveEvent.clientY - offsetY));
				setRight(getX(document.body.offsetWidth - mousemoveEvent.pageX - offsetX));
			}
		};
	};
	const onMouseUp: MouseEventHandler<HTMLDivElement> = async () => {
		window.onmousemove = null;
		storage.set('toolPosition', { top, right });
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
	return isTool ? (
		<>
			<div
				className='tun-tool-main'
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				style={{
					top: top + 'px',
					right: right + 'px',
					zIndex: '99999',
				}}
			>
				<Popover
					content={ToolPopup}
					visible={popupShow}
					placement="leftTop"
					getPopupContainer={() => document.querySelector('#tun-tool-popup').shadowRoot.querySelector('.tun-tool-main') as HTMLElement}
				>
					<div className='icon-main'
						onClick={onToolClick}
					>
						<ToolOutlined className='icon' />
					</div>
				</Popover>
			</div>
		</>
	) : null;
};

export default Tool;
