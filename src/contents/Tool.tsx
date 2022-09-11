/* eslint-disable react/react-in-jsx-scope */
import React, { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import type { PlasmoContentScript } from 'plasmo';
import { Storage, useStorage } from '@plasmohq/storage';
import { ToolOutlined } from '@ant-design/icons';
import type { TooltipPlacement } from 'antd/lib/tooltip';
import {
	Button, Modal, Popover,
	Image, ModalProps, Descriptions,
	message, Space,
} from 'antd';

import { API, Tool as tool } from '~utils';

import toolCss from 'data-text:./Tool.scss';
import antdCss from 'data-text:antd/dist/antd.css';

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

// 图片弹出层接口
interface ImageModalProps extends ModalProps {
	src?: string;
}

// 全局message配置
message.config({
	top: 70,
	duration: 1.5,
	maxCount: 3,
	getContainer: () => document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container'),
});

// 图片弹出层
export const ImageModal = (props: ImageModalProps) => {
	const { src = '' } = props;
	return (
		<Modal {...props}>
			<Image
				preview={false}
				src={src}
				style={{ borderRadius: '10px' }}
				fallback="data:image/png;base64,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"
			/>
		</Modal>
	);
};

// 视频详细信息内容组件
const VideoDesItem = ({ value }: { value: string | number }) => (
	<div
		style={{
			cursor: 'pointer',
		}}
		onClick={() => {
			tool.copyDataToClipboard(value)
				.then(() => {
					message.success('复制成功');
				}).catch((e) => {
					console.error(e);
					message.error('复制失败');
				});
		}}
	>{value}</div>
);

// tool 弹出层
const ToolPopup = () => {
	const [picBtnLoading, setPicBtnLoading] = useState(false);
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [videoId, setVideoId] = useState('');
	const [videoInfo, setVideoInfo] = useState<any>({
		pic: '',
		aid: 0,
		bvid: '',
		cid: 0,
	});

	// 通过网址获取视频唯一标识
	const getVideoId = () => {
		const path = location.pathname;
		const [id] = path.match(/(BV|bv).{10}/);
		return id;
	};

	// url改变事件
	const onUrlChanged = useCallback(() => {
		setVideoId(getVideoId());
	}, []);

	useEffect(() => {
		setVideoId(getVideoId());
		window.addEventListener('pushState', onUrlChanged);
		window.addEventListener('popstate', onUrlChanged);
		return () => {
			window.removeEventListener('pushState', onUrlChanged);
			window.removeEventListener('popstate', onUrlChanged);
		};
	}, []);

	useEffect(() => {
		const updateVideoInfo = async () => {
			if (videoId !== '') {
				try {
					const data = await API.getVideoInfo(videoId);
					setVideoInfo(data);
				} catch (error) {
					console.error(error);
				}
			}
		};
		updateVideoInfo();
	}, [videoId]);

	// 视频封面按钮点击事件
	const onPicBtnClicked = async () => {
		setPicBtnLoading(true);
		try {
			setImageModalOpen(true);
		} catch (error) {
			console.error(error);
		} finally {
			setPicBtnLoading(false);
		}
	};
	// image弹出层退出
	const imageModalCancel = () => {
		setImageModalOpen(false);
	};
	// 复制图片至剪贴板按钮
	const onCopyImgBtnClicked = async () => {
		try {
			tool.copyImg(videoInfo.pic ?? '');
			message.success('复制成功');
		} catch (error) {
			message.error('复制失败');
			console.error(error);
		}
	};

	// 视频信息列表配置
	const VideoDesConfig = useMemo(() => ([
		{
			label: 'av号',
			value: videoInfo.aid,
		},
		{
			label: 'bv号',
			value: videoInfo.bvid,
		},
		{
			label: 'cid',
			value: videoInfo.cid,
		},
	]), [videoInfo]);

	return (
		<div className='tun-popup-main'>
			<Space style={{ width: '100%' }} direction="vertical">
				{/* 视频信息 */}
				<Descriptions bordered column={1} size={'small'} title="视频信息-点击复制">
					{
						VideoDesConfig.map(item => (
							<Descriptions.Item key={item.label} label={item.label}>
								<VideoDesItem value={item.value}></VideoDesItem>
							</Descriptions.Item>
						))
					}
				</Descriptions>
				{/* 视频封面 */}
				<Button onClick={onPicBtnClicked} loading={picBtnLoading}>视频封面</Button>
				<ImageModal
					centered
					width={720}
					title={'视频封面'}
					src={videoInfo.pic ?? ''}
					cancelText={'返回'}
					okText={'复制图片至剪切板'}
					visible={imageModalOpen}
					onCancel={imageModalCancel}
					onOk={onCopyImgBtnClicked}
					getContainer={
						document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
					}
				></ImageModal>
				{/* 分享 */}
			</Space>
		</div>
	);
};

// tool main
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
	const getPopupContainer = useMemo<TooltipPlacement>(() => `${document.body.offsetWidth - right - TOOL_SIZE > 350 ? 'left' : 'right'}${document.body.offsetHeight - top > 530 ? 'Top' : 'Bottom'}`, [top, right]);
	return isTool ? (
		<>
			<div
				className='tun-tool-main'
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				style={{
					top: top + 'px',
					right: right + 'px',
				}}
			>
				<Popover
					content={ToolPopup}
					visible={popupShow}
					placement={getPopupContainer}
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
