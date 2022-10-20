/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Descriptions, message, Row, Slider, Space } from 'antd';

import { API, Tool } from '~utils';
import { DownloadVideoModal, ImageModal, PopupTitle } from '~contents-components';

// 视频详细信息内容组件
const VideoDesItem = ({ value }: { value: string | number }) => (
	<div
		style={{
			cursor: 'pointer',
		}}
		onClick={() => {
			Tool.copyDataToClipboard(value)
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
		const copyText = `【${data.title}】\nup主: ${data.owner?.name ?? ''}\n视频链接: https://www.bilibili.com/video/${data.bvid ?? ''}`;
		try {
			Tool.copyDataToClipboard(copyText);
			message.success('复制成功');
		} catch (error) {
			console.error(error);
			message.error('复制失败');
		}
	};
	return (<Button size={'small'} onClick={copyData}>获取视频分享信息</Button>);
};

// tool 弹出层
export const VideoToolPopup = () => {
	const [picBtnLoading, setPicBtnLoading] = useState(false);
	const [picModalOpen, setPicModalOpen] = useState(false);
	const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
	const [screenshotData, setScreenshotData] = useState('');
	const [downloadVideoModalOpen, setDownloadVideoModalOpen] = useState(false);
	const [videoId, setVideoId] = useState('');
	const [videoInfo, setVideoInfo] = useState<any>({});
	const [playbackrate, setPlaybackrate] = useState(1);

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

	const onRateChange = useCallback((e: Event) => {
		setPlaybackrate((e.target as HTMLVideoElement).playbackRate);
	}, []);

	useEffect(() => {
		setVideoId(getVideoId());
		window.addEventListener('pushState', onUrlChanged);
		window.addEventListener('popstate', onUrlChanged);
		const videoElement = document.querySelector('#bilibili-player video') as HTMLVideoElement;
		videoElement.addEventListener('ratechange', onRateChange);
		return () => {
			window.removeEventListener('pushState', onUrlChanged);
			window.removeEventListener('popstate', onUrlChanged);
			videoElement.removeEventListener('ratechange', onRateChange);
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
			Tool.copyImg(videoInfo.pic ?? '');
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
			Tool.copyImg(screenshotData ?? '');
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

	// 获取视频短链
	const getShortUrl = async () => {
		const fullUrl = location.origin + location.pathname;
		try {
			const data = await chrome.runtime.sendMessage(
				{
					type: 'getShortUrl',
					url: fullUrl,
				},
			);
			Tool.copyDataToClipboard(data.content);
			message.success('复制短链成功');
		} catch (error) {
			message.error('复制短链失败');
			console.error(error);
		}
	};

	// 获取空降链接
	const getTimestampUrl = () => {
		try {
			const videoElement = document.querySelector('#bilibili-player video') as HTMLVideoElement;
			const timestampUrl = `${location.href}&t=${Math.floor(videoElement.currentTime)}`;
			Tool.copyDataToClipboard(timestampUrl);
			message.success('复制短链成功');
		} catch (error) {
			message.error('复制空降链接失败');
			console.error(error);
		}
	};

	// 视频倍速值改变事件
	const onPlaybackrateChange = (value: number) => {
		setPlaybackrate(value);
	};

	useEffect(() => {
		const videoElement = document.querySelector('#bilibili-player video') as HTMLVideoElement;
		videoElement.playbackRate = playbackrate;
	}, [playbackrate]);

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
				{/* 视频工具 */}
				<PopupTitle style={{ marginTop: '8px' }}>视频工具</PopupTitle>
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
							open={picModalOpen}
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
							open={screenshotModalOpen}
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
							open={downloadVideoModalOpen}
							onCancel={downloadVideoModalCancel}
							getContainer={
								document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
							}
							videoInfo={videoInfo}
						></DownloadVideoModal>
					</Col>
					<Col span={8}>
						{/* 视频短链 */}
						<Button onClick={getShortUrl}>视频短链</Button>
					</Col>
					<Col span={8}>
						{/* 空降链接 */}
						<Button onClick={getTimestampUrl}>空降链接</Button>
					</Col>
					{/* <Col span={8}>
						<Button onClick={getDanmuBtnClicked}>获取弹幕</Button>
					</Col> */}
				</Row>
				{/* 视频倍速 */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginTop: '8px',
				}}>
					<PopupTitle>
						视频倍速
					</PopupTitle>
					<Button size='small' onClick={() => setPlaybackrate(1)}>重置倍速</Button>
				</div>
				<Slider
					min={0}
					max={15}
					onChange={onPlaybackrateChange}
					value={playbackrate}
					step={0.1}
					tooltip={{
						getPopupContainer: () => (
							document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
						),
					}}
				></Slider>
			</Space>
		</div>
	);
};
