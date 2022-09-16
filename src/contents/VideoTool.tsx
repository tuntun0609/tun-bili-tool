/* eslint-disable react/react-in-jsx-scope */
import React, {
	MouseEventHandler, ReactNode, useCallback,
	useEffect, useMemo, useState,
} from 'react';
import type { PlasmoContentScript } from 'plasmo';
import { Storage, useStorage } from '@plasmohq/storage';
import { ToolOutlined } from '@ant-design/icons';
import type { TooltipPlacement } from 'antd/lib/tooltip';
import {
	Button, Modal, Popover,
	Image as AntImage, ModalProps, Descriptions,
	message, Space, ConfigProvider, Col, Row,
	Table, Select,
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import axios from 'axios';
import { isUndefined } from 'lodash';

import { API, Tool as tool } from '~utils';

import toolCss from 'data-text:./VideoTool.scss';
// import antdCss from 'data-text:antd/dist/antd.css';
import antdCss from 'data-text:antd/dist/antd.variable.min.css';
import type { ColumnsType } from 'antd/lib/table';

ConfigProvider.config({
	theme: {
		primaryColor: '#fb7299',
		successColor: '#52c41a',
		warningColor: '#faad14',
		errorColor: '#f5222d',
	},
});

const storage = new Storage();
const { Option } = Select;

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
		<Modal
			destroyOnClose
			bodyStyle={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			{...props}
		>
			<AntImage
				preview={{
					getContainer: document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement,
				}}
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

interface DownloadVideoModalProps extends ModalProps {
	videoInfo: any,
	onProgress?: (progress: number) => void,
}
// videoList数据源接口
interface VideoListItemType {
  key: number;
  title: string;
	cid: number;
}
// videoList列配置
const videoListColumns: ColumnsType<VideoListItemType> = [
	{
		title: '分P数',
		dataIndex: 'key',
	},
	{
		title: '分P名',
		dataIndex: 'title',
	},
	{
		title: 'cid',
		dataIndex: 'cid',
	},
];
// 视频分p展示组件
const VideoList = (props: any) => (
	<Table
		{...props}
		pagination={{
			defaultPageSize: 5,
		}}
		columns={videoListColumns}
	></Table>
);

// 大会员图标
const VipIcon = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>) => (
	<i {...props} className='tun-vip-icon'></i>
);

// 下载视频弹出层
const DownloadVideoModal = (props: DownloadVideoModalProps) => {
	const { videoInfo } = props;
	const [videoDownloadInfo, setVideoDownloadInfo] = useState<any>({});
	const [videoListData, setVideoListData] = useState<VideoListItemType[]>([]);
	const [cid, setCid] = useState<number>(videoInfo.pages[0].cid ?? 0);
	const [videoSource, setVideoSource] = useState(0);

	// 视频下载链接
	const getVideoUrl = async (bvid: string, cid: number, qn?: number) => {
		const data = await axios.get('https://api.bilibili.com/x/player/playurl', {
			params: {
				bvid: bvid,
				cid: cid,
				qn: qn,
				fourk: 1,
			},
			withCredentials: true,
		});
		// download(data.data.data.durl[0].url, videoInfo.title, 'flv');
		return data;
	};

	// 通过axios下载视频方法
	// const downloadByAxios = (url: string, name: string, type: string) => new Promise<void>((resolve, reject) => {
	// 	axios(url, {
	// 		method: 'get',
	// 		responseType: 'blob',
	// 		onDownloadProgress: (evt: any) => {
	// 			if (onProgress !== undefined) {
	// 				const progress = Math.floor(((evt.loaded / evt.total) * 100) * 100) / 100;
	// 				onProgress(progress);
	// 			}
	// 		},
	// 	})
	// 		.then((res) => {
	// 			const blob = new Blob([res.data]);
	// 			const a = document.createElement('a');
	// 			a.download = `${name}.${type}`;
	// 			a.href = URL.createObjectURL(blob);
	// 			a.click();
	// 			URL.revokeObjectURL(a.href);
	// 			a.remove();
	// 			resolve();
	// 		})
	// 		.catch((err) => {
	// 			reject(err);
	// 		});
	// });

	// 通过浏览器下载
	const downloadByBrowser = async (qn: number, scource?: number) => {
		try {
			const data = await getVideoUrl(videoInfo.bvid, cid, qn);
			const allUrl = [data.data.data.durl[0].url, ...data.data.data.durl[0].backup_url];
			const url = allUrl[scource ?? 0] ?? allUrl[0];
			const a = document.createElement('a');
			a.href = url;
			a.target = '__blank';
			a.click();
			a.remove();
		} catch (error) {
			console.error(error);
			message.error('下载发生错误');
		}
	};

	// videoList radio选择事件
	const videoListRowSelection = {
		onChange: (_selectedRowKeys: React.Key[], selectedRows: VideoListItemType[]) => {
			setCid(selectedRows[0].cid);
		},
		getCheckboxProps: (record: VideoListItemType) => ({
			key: record.key,
			title: record.title,
			cid: record.cid,
		}),
	};

	// bvid改变时
	useEffect(() => {
		setCid(videoInfo.cid);
		const main = async () => {
			try {
				if (!isUndefined(videoInfo.bvid)) {
					setVideoListData(videoInfo.pages.map((item: any, i: number) => ({
						key: i + 1,
						title: item.part,
						cid: item.cid,
					})));
					const data = await getVideoUrl(videoInfo.bvid, videoInfo.cid);
					setVideoDownloadInfo(data.data.data ?? {});
				}
			} catch (error) {
				message.error('获取下载信息错误');
			}
		};
		main();
	}, [videoInfo]);

	return (
		<Modal
			{...props}
		>
			<Space style={{ width: '100%' }} direction="vertical">
				{/* 分p选择器 */}
				{
					videoListData.length !== 1 ?
						<div>
							<div className='popup-title'>选择分P</div>
							<VideoList
								size="small"
								rowSelection={{
									type: 'radio',
									...videoListRowSelection,
								}}
								dataSource={videoListData}
							></VideoList>
						</div>
						: null
				}
				{/* 线路选择 */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
					<div className='popup-title' style={{ marginRight: '8px' }}>下载线路</div>
					<Select
						size={'small'}
						defaultValue={0}
						onChange={value => setVideoSource(value)}
						dropdownStyle={{ zIndex: '9999999999' }}
						getPopupContainer={() => document.querySelector('#tun-tool-popup').shadowRoot as any}
					>
						<Option value={0}>线路1</Option>
						<Option value={1}>线路2</Option>
						<Option value={2}>线路3</Option>
					</Select>
				</div>
				{/* 不同清晰度下载按钮 */}
				<div className='popup-title'>视频下载</div>
				<Row
					wrap
					align={'middle'}
					justify={'start'}
					gutter={[8, 8]}
				>
					{
						videoDownloadInfo.accept_quality?.map((item: number, index: string | number) => (
							<Col key={item} span={6}>
								<div style={{ position: 'relative' }}>
									<Button
										block
										onClick={() => {
											downloadByBrowser(item, videoSource);
										}}
									>{videoDownloadInfo.accept_description[index]}</Button>
									{item >= 112 ? <VipIcon></VipIcon> : null}
								</div>
							</Col>
						))
					}
				</Row>
			</Space>
		</Modal>
	);
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
	const getDanmuBtnClicked = async () => {
		const data = await chrome.runtime.sendMessage({
			type: 'getDanmu',
		});
		console.log(data);
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
						<Col span={8}>
							{/* 视频下载 */}
							<Button onClick={getDanmuBtnClicked}>获取弹幕</Button>
						</Col>
					</Row>
				</div>
			</Space>
		</div>
	);
};

// tool main
const VideoTool = () => {
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
	const popupPlacement = useMemo<TooltipPlacement>(() => `${document.body.offsetWidth - right - TOOL_SIZE > 350 ? 'left' : 'right'}${document.body.offsetHeight - top > 530 ? 'Top' : 'Bottom'}`, [top, right]);
	return isTool ? (
		<ConfigProvider locale={zhCN}>
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
					placement={popupPlacement}
					getPopupContainer={() => document.querySelector('#tun-tool-popup').shadowRoot.querySelector('.tun-tool-main') as HTMLElement}
				>
					<div className='icon-main'
						onClick={onToolClick}
					>
						<ToolOutlined className='icon' />
					</div>
				</Popover>
			</div>
		</ ConfigProvider>
	) : null;
};

export default VideoTool;
