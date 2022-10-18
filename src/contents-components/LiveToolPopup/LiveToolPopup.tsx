/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Button, Col, Form, message, Row, Space, Switch } from 'antd';
import { isUndefined } from 'lodash';

import { API, Tool, log, isInIframe } from '../../utils';
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
	const [onlineNum, setOnlineNum] = useState(0);

	const getRoomId = () => {
		if (location.pathname.startsWith('/blanc')) {
			return parseInt(location.pathname.slice(7), 10);
		}
		return parseInt(location.pathname.slice(1), 10);
	};

	useEffect(() => {
		setRoomid(getRoomId());
		const shieldStyle = document.createElement('style');
		shieldStyle.id = 'tun-shield-style';
		document.body.appendChild(shieldStyle);
	}, []);

	useEffect(() => {
		form.setFieldsValue(liveShield);
		injectShieldStyle(liveShield);
	}, [liveShield]);

	// 更新在线活跃人数
	const updateOnlineNum = async (props: { ruid: number; roomId: number; page: number; pageSize: number; }) => {
		try {
			const data = await API.getOnlineGoldRank(props);
			setOnlineNum(data.data.onlineNum);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		let updateOnlineNumId: string | number | NodeJS.Timeout;
		const updateLiveInfo = async () => {
			if (!isUndefined(roomid)) {
				try {
					const data = await API.getLiveInfo(roomid);
					log(data.data);
					setRoomInfo(data.data);
					updateOnlineNum({
						ruid: data.data.uid,
						roomId: data.data.room_id,
						page: 1,
						pageSize: 1,
					});
					updateOnlineNumId = setInterval(() => {
						updateOnlineNum({
							ruid: data.data.uid,
							roomId: data.data.room_id,
							page: 1,
							pageSize: 1,
						});
					}, 60000);
				} catch (error) {
					console.error(error);
				}
			}
		};
		updateLiveInfo();
		return () => {
			clearInterval(updateOnlineNumId);
		};
	}, [roomid]);

	// 直播截图
	const screenshotBtnClicked = () => {
		try {
			if (roomInfo.live_status !== 0) {
				const videoElement = document.querySelector('.live-player-mounter video') as HTMLVideoElement;
				const screenshotCanvas = document.createElement('canvas');
				screenshotCanvas.width = videoElement.videoWidth;
				screenshotCanvas.height = videoElement.videoHeight;
				screenshotCanvas.getContext('2d')
					.drawImage(videoElement, 0, 0, screenshotCanvas.width, screenshotCanvas.height);
				setScreenshotData(screenshotCanvas.toDataURL('image/png'));
				setScreenshotModalOpen(true);
				screenshotCanvas.remove();
			} else {
				message.error('主播未开播, 无法截图');
			}
		} catch (error) {
			message.error('发生错误, 请刷新页面');
		}
	};

	const screenModalCancel = () => {
		setScreenshotModalOpen(false);
	};

	const onCopyScreenshotBtnClicked = () => {
		try {
			Tool.copyImg(screenshotData ?? '');
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
			Tool.copyImg(roomInfo.user_cover ?? '');
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
			Tool.copyImg(roomInfo.background ?? '');
			message.success('复制成功');
		} catch (error) {
			message.error('复制失败');
			console.error(error);
		}
	};

	// 直播间分享
	const shareLiveRoom = () => {
		const upName = document.querySelector('.room-owner-username').innerHTML;
		const copyText = `直播间标题: ${roomInfo.title}\nup主: ${upName}\n直播间链接: https://live.bilibili.com/${roomInfo.room_id}`;
		try {
			Tool.copyDataToClipboard(copyText);
			message.success('复制成功');
		} catch (error) {
			console.error(error);
			message.error('复制失败');
		}
	};

	// 返回原版直播间
	const backToOriginRoom = () => {
		window.top.location.href = `${location.origin}${location.pathname}`;
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
			style: '.chat-emoticon {display:none !important;} .emoji-animation-area {display:none !important;}',
		},
		{
			name: 'emoticon-danmu',
			label: '表情(弹幕)',
			style: '.danmaku-item-container .danmaku-emoji img {display:none !important;}',
		},
		{
			name: 'systemMsg',
			label: '系统公告',
			style: '.chat-item.system-msg, .chat-item.convention-msg{display:none !important;}',
		},
		{
			name: 'pk',
			label: 'PK',
			style: '#chaos-pk-vm {display:none !important;}',
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
				{/* 在线活跃人数 */}
				<PopupTitle style={{ marginTop: '8px' }}>在线活跃人数: {onlineNum}</PopupTitle>
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
					{
						roomInfo.background
							? <Col span={8}>
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
							: null
					}
					<Col span={8}>
						<Button onClick={shareLiveRoom}>分享直播</Button>
					</Col>
					{
						isInIframe()
							? <Col span={8}>
								<Button onClick={backToOriginRoom}>原直播间</Button>
							</Col>
							: null
					}
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
