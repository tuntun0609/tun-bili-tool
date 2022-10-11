/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Button, Col, message, Row, Space } from 'antd';
import { isUndefined } from 'lodash';

import { API, Tool as tool } from '../../utils';
import { ImageModal, PopupTitle } from '~contents-components';

// tool 弹出层
export const LiveToolPopup = () => {
	const [roomid, setRoomid] = useState<number>(undefined);
	const [screenshotData, setScreenshotData] = useState<string>('');
	const [roomInfo, setRoomInfo] = useState<any>({});
	const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
	const [userCoverModalOpen, setUserCoverModalOpen] = useState(false);

	useEffect(() => {
		setRoomid(parseInt(location.pathname.slice(1), 10));
	}, []);

	useEffect(() => {
		const updateLiveInfo = async () => {
			if (!isUndefined(roomid)) {
				try {
					const data = await API.getLiveInfo(roomid);
					console.log(data.data);
					setRoomInfo(data.data);
				} catch (error) {
					console.error(error);
				}
			}
		};
		updateLiveInfo();
	}, [roomid]);

	// 直播截图
	const screenshotBtnClicked = () => {
		const videoElement = document.querySelector('.live-player-mounter video') as HTMLVideoElement;
		const screenshotCanvas = document.createElement('canvas');
		screenshotCanvas.width = videoElement.videoWidth;
		screenshotCanvas.height = videoElement.videoHeight;
		screenshotCanvas.getContext('2d')
			.drawImage(videoElement, 0, 0, screenshotCanvas.width, screenshotCanvas.height);
		setScreenshotData(screenshotCanvas.toDataURL('image/png'));
		setScreenshotModalOpen(true);
		screenshotCanvas.remove();
	};

	const screenModalCancel = () => {
		setScreenshotModalOpen(false);
	};

	const onCopyScreenshotBtnClicked = () => {
		try {
			tool.copyImg(screenshotData ?? '');
			message.success('复制成功');
		} catch (error) {
			message.error('复制失败');
			console.error(error);
		}
	};

	// 直播封面
	const userCoverBtnClicked = () => {
		setUserCoverModalOpen(true);
	};

	const userCoverModalCancel = () => {
		setUserCoverModalOpen(false);
	};

	const onCopyUserCoverBtnClicked = () => {
		try {
			tool.copyImg(roomInfo.user_over ?? '');
			message.success('复制成功');
		} catch (error) {
			message.error('复制失败');
			console.error(error);
		}
	};

	return (
		<div className='tun-popup-main'>
			<Space style={{ width: '100%' }} direction="vertical">
				{/* 直播工具 */}
				<PopupTitle style={{ marginTop: '8px' }}>直播工具</PopupTitle>
				<Row wrap gutter={[16, 8]} >
					<Col span={8}>
						<Button onClick={screenshotBtnClicked}>直播截图</Button>
						<ImageModal
							centered
							width={720}
							title={'直播截图'}
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
						<Button onClick={userCoverBtnClicked}>直播封面</Button>
						<ImageModal
							centered
							width={720}
							title={'直播封面'}
							src={roomInfo.user_cover ?? ''}
							cancelText={'返回'}
							okText={'复制图片至剪切板'}
							open={userCoverModalOpen}
							onCancel={userCoverModalCancel}
							onOk={onCopyUserCoverBtnClicked}
							getContainer={
								document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
							}
						></ImageModal>
					</Col>
				</Row>
			</Space>
		</div>
	);
};
