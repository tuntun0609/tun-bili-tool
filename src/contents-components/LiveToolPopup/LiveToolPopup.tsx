/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Button, Col, Form, message, Row, Space, Switch } from 'antd';
import { isUndefined } from 'lodash';

import { API, Tool as tool } from '../../utils';
import { ImageModal, PopupTitle } from '~contents-components';
import { useStorage } from '@plasmohq/storage';

interface ShieldOption {
	name: string | number,
	label?: string | number,
	style?: string,
}

// tool 弹出层
export const LiveToolPopup = () => {
	const [roomid, setRoomid] = useState<number>(undefined);
	const [screenshotData, setScreenshotData] = useState<string>('');
	const [roomInfo, setRoomInfo] = useState<any>({});
	const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
	const [userCoverModalOpen, setUserCoverModalOpen] = useState(false);
	const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [liveShield, setLiveShield] = useStorage('liveShield', {});

	useEffect(() => {
		setRoomid(parseInt(location.pathname.slice(1), 10));
		const shieldStyle = document.createElement('style');
		shieldStyle.id = 'tun-shield-style';
		document.body.appendChild(shieldStyle);
	}, []);

	useEffect(() => {
		form.setFieldsValue(liveShield);
		injectShieldStyle(liveShield);
	}, [liveShield]);

	useEffect(() => {
		const updateLiveInfo = async () => {
			if (!isUndefined(roomid)) {
				try {
					const data = await API.getLiveInfo(roomid);
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

	// 直播背景
	const backgroundBtnClicked = () => {
		setBackgroundModalOpen(true);
	};

	const backgroundModalCancel = () => {
		setBackgroundModalOpen(false);
	};

	const onCopyBackgroundBtnClicked = () => {
		try {
			tool.copyImg(roomInfo.background ?? '');
			message.success('复制成功');
		} catch (error) {
			message.error('复制失败');
			console.error(error);
		}
	};

	// 屏蔽选项发生改变
	const shieldFormChange = (_changedValues: any, allValues: any) => {
		setLiveShield(allValues);
	};

	const shieldOptions: ShieldOption[] = [
		{
			name: 2233,
			label: '2233娘',
			style: '#my-dear-haruna-vm{display:none !important;}',
		},
		{
			name: 'fansMedal',
			label: '粉丝勋章',
			style: '.chat-item .fans-medal-item-ctnr,.chat-item .title-label{display:none !important;}',
		},
		{
			name: 'gift',
			label: '礼物信息',
			style: '.chat-item.top3-notice, .chat-item.gift-item, #chat-gift-bubble-vm {display:none !important;}',
		},
		{
			name: 'emoticon-chat',
			label: '表情(聊天栏)',
			style: '.chat-emoticon {display:none !important;}',
		},
		{
			name: 'emoticon-danmu',
			label: '表情(弹幕)',
			style: '.danmaku-item-container .danmaku-emoji img {display:none !important;}',
		},
	];

	// 插入屏蔽style
	const injectShieldStyle = (options: { [key: string]: any }) => {
		const shieldStyle = document.querySelector('#tun-shield-style');
		const styleText = shieldOptions.map(item => (
			options[item.name]
				? item.style : ''
		)).join(' ');
		if (shieldStyle) {
			shieldStyle.innerHTML = styleText;
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
					<Col span={8}>
						<Button onClick={backgroundBtnClicked}>直播背景</Button>
						<ImageModal
							centered
							width={720}
							title={'直播背景'}
							src={roomInfo.background ?? ''}
							cancelText={'返回'}
							okText={'复制图片至剪切板'}
							open={backgroundModalOpen}
							onCancel={backgroundModalCancel}
							onOk={onCopyBackgroundBtnClicked}
							getContainer={
								document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
							}
						></ImageModal>
					</Col>
				</Row>
				{/* 直播屏蔽 */}
				<PopupTitle style={{ marginTop: '8px' }}>直播屏蔽</PopupTitle>
				<Form
					form={form}
					labelWrap
					labelAlign={'left'}
					size={'middle'}
					labelCol={{
						style: {
							width: 'calc(100% - 48px)',
							padding: '2px 0px 2px 4px',
						},
					}}
					wrapperCol={{
						style: {
							justifyContent: 'center',
						},
					}}
					onValuesChange={shieldFormChange}
				>
					{
						shieldOptions.map(item => (
							<Form.Item
								key={item.name}
								label={item.label ?? item.name}
							>
								<Form.Item
									noStyle
									name={item.name}
									valuePropName="checked"
								>
									<Switch />
								</Form.Item>
							</Form.Item>
						))
					}
				</Form>
			</Space>
		</div>
	);
};
