import React, {
	MouseEventHandler, ReactNode, useCallback,
	useEffect, useMemo, useState,
} from 'react';
import type { PlasmoContentScript } from 'plasmo';
import { Storage, useStorage } from '@plasmohq/storage';
import { ToolOutlined } from '@ant-design/icons';
import type { TooltipPlacement } from 'antd/lib/tooltip';
import {
	Button, Popover, Descriptions,
	message, Space, ConfigProvider,
	Col, Row,
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import { API, Tool as tool } from '~utils';
import { ImageModal, DownloadVideoModal } from '../contents-components';

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

// 分享视频信息按钮
const ShareVideoInfoBtn = ({ data = {} }: { data: any }) => {
	const copyData = async () => {
		const copyText = `视频标题: ${data.title}\nup主: ${data.owner?.name ?? ''}\n视频链接: https://www.bilibili.com/video/${data.bvid ?? ''}`;
		try {
			tool.copyDataToClipboard(copyText);
			message.success('复制成功');
		} catch (error) {
			console.error(error);
			message.error('复制失败');
		}
	};
	return (<Button size={'small'} onClick={copyData}>获取视频分享信息</Button>);
};

const PopupTitle = (props: { children: ReactNode }) => (
	<div className='popup-title'>{ props.children }</div>
);

// tool 弹出层
const ToolPopup = () => {
	const [picBtnLoading, setPicBtnLoading] = useState(false);
	const [picModalOpen, setPicModalOpen] = useState(false);
	const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
	const [screenshotData, setScreenshotData] = useState('');
	const [downloadVideoModalOpen, setDownloadVideoModalOpen] = useState(false);
	const [videoId, setVideoId] = useState('');
	const [videoInfo, setVideoInfo] = useState<any>({});

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
	const picBtnClicked = async () => {
		setPicBtnLoading(true);
		try {
			setPicModalOpen(true);
		} catch (error) {
			console.error(error);
		} finally {
			setPicBtnLoading(false);
		}
	};
	// 视频封面弹出层退出
	const picModalCancel = () => {
		setPicModalOpen(false);
	};
	// 复制图片至剪贴板按钮
	const onCopyPicBtnClicked = async () => {
		try {
			tool.copyImg(videoInfo.pic ?? '');
			message.success('复制成功');
		} catch (error) {
			message.error('复制失败');
			console.error(error);
		}
	};
	// 视频截图按钮点击事件
	const screenshotBtnClicked = () => {
		const videoElement = document.querySelector('#bilibili-player video') as HTMLVideoElement;
		const screenshotCanvas = document.createElement('canvas');
		screenshotCanvas.width = videoElement.videoWidth;
		screenshotCanvas.height = videoElement.videoHeight;
		screenshotCanvas.getContext('2d')
			.drawImage(videoElement, 0, 0, screenshotCanvas.width, screenshotCanvas.height);
		setScreenshotData(screenshotCanvas.toDataURL('image/png'));
		setScreenshotModalOpen(true);
		screenshotCanvas.remove();
	};
	// 视频截图弹窗返回
	const screenModalCancel = () => {
		setScreenshotModalOpen(false);
	};
	// 复制截图至剪贴板
	const onCopyScreenshotBtnClicked = () => {
		try {
			tool.copyImg(screenshotData ?? '');
			message.success('复制成功');
		} catch (error) {
			message.error('复制失败');
			console.error(error);
		}
	};
	// 下载按钮点击事件
	const downloadVideoBtnClicked = () => {
		setDownloadVideoModalOpen(true);
	};
	// 下载弹出层退出
	const downloadVideoModalCancel = () => {
		setDownloadVideoModalOpen(false);
	};
	// 视频弹幕按钮点击事件
	// const getDanmuBtnClicked = async () => {
	// 	const data = await chrome.runtime.sendMessage({
	// 		type: 'getDanmu',
	// 	});
	// 	console.log(data);
	// };
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
		// {
		// 	label: 'cid',
		// 	value: videoInfo.cid,
		// },
	]), [videoInfo]);

	return (
		<div className='tun-popup-main'>
			<Space style={{ width: '100%' }} direction="vertical">
				{/* 视频信息 */}
				<Descriptions
					bordered
					column={1}
					size={'small'}
					title="视频信息-点击复制"
					extra={<ShareVideoInfoBtn data={videoInfo}></ShareVideoInfoBtn>}
				>
					{
						VideoDesConfig.map(item => (
							<Descriptions.Item
								key={item.label}
								label={item.label}
							>
								<VideoDesItem value={item.value}></VideoDesItem>
							</Descriptions.Item>
						))
					}
				</Descriptions>
				<PopupTitle>视频工具</PopupTitle>
				<div>
					{/* 视频封面 */}
					<Row wrap gutter={[16, 8]} >
						<Col span={8}>
							{/* 视频封面 */}
							<Button onClick={picBtnClicked} loading={picBtnLoading}>视频封面</Button>
							<ImageModal
								centered
								width={720}
								title={'视频封面'}
								src={videoInfo.pic ?? ''}
								cancelText={'返回'}
								okText={'复制图片至剪切板'}
								visible={picModalOpen}
								onCancel={picModalCancel}
								onOk={onCopyPicBtnClicked}
								getContainer={
									document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
								}
							></ImageModal>
						</Col>
						<Col span={8}>
							{/* 视频画面 */}
							<Button onClick={screenshotBtnClicked}>视频截图</Button>
							<ImageModal
								centered
								width={720}
								title={'视频截图'}
								src={screenshotData ?? ''}
								cancelText={'返回'}
								okText={'复制图片至剪切板'}
								visible={screenshotModalOpen}
								onCancel={screenModalCancel}
								onOk={onCopyScreenshotBtnClicked}
								getContainer={
									document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
								}
							></ImageModal>
						</Col>
						<Col span={8}>
							{/* 视频下载 */}
							<Button onClick={downloadVideoBtnClicked}>视频下载</Button>
							<DownloadVideoModal
								centered
								width={620}
								title={'视频下载'}
								footer={null}
								visible={downloadVideoModalOpen}
								onCancel={downloadVideoModalCancel}
								getContainer={
									document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
								}
								videoInfo={videoInfo}
								// onProgress={p => console.log(p)}
							></DownloadVideoModal>
						</Col>
						{/* <Col span={8}>
							<Button onClick={getDanmuBtnClicked}>获取弹幕</Button>
						</Col> */}
					</Row>
				</div>
			</Space>
		</div>
	);
};

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
				content={ToolPopup}
				visible={popupShow}
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
