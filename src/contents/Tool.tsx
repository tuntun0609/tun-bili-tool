/* eslint-disable react/react-in-jsx-scope */
import type { PlasmoContentScript } from 'plasmo';
import { Storage, useStorage } from '@plasmohq/storage';
import { ToolOutlined } from '@ant-design/icons';

import cssText from 'data-text:./Tool.scss';
import { MouseEventHandler, useEffect, useState } from 'react';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/video/*'],
};

export const getMountPoint = async () => document.querySelector('body');

export const getStyle = () => {
	const style = document.createElement('style');
	style.textContent = cssText;
	return style;
};

const Tool = () => {
	const TOOL_SIZE = 36;
	const [isTool] = useStorage('isTool', false);
	const [position, setPosition] = useState({ top: -TOOL_SIZE, right: -TOOL_SIZE });
	const [top, setTop] = useState(-TOOL_SIZE);
	const [right, setRight] = useState(-TOOL_SIZE);

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

	const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		const offsetY = e.clientY - top;
		const offsetX = document.body.offsetWidth - e.pageX - right;
		window.onmousemove = (e: MouseEvent) => {
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
			setTop(getY(e.clientY - offsetY));
			setRight(getX(document.body.offsetWidth - e.pageX - offsetX));
		};
	};
	const onMouseUp: MouseEventHandler<HTMLDivElement> = async () => {
		window.onmousemove = null;
		storage.set('toolPosition', { top, right });
	};
	return isTool ? (
		<>
			<div
				className='main'
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				style={{
					top: top + 'px',
					right: right + 'px',
					zIndex: '99999',
				}}
			>
				<ToolOutlined className='icon' />
			</div>
		</>
	) : null;
};

export default Tool;
