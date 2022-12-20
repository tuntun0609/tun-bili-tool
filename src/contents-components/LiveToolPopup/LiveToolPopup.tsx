/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, message, Row, Space, Switch } from 'antd';
import { isUndefined } from 'lodash';

import { API, Tool, log, isInIframe, TOOL_ID, getMessageConfig } from '../../utils';
import { ImageModal, PopupTitle, ScListModal, WheelbarrowModal } from '~contents-components';
import { useStorage } from '@plasmohq/storage/hook';
import { useMutationObservable } from '~utils/useMutationObservable';

interface ShieldOption {
	name: string | number,
	label?: string | number,
	style?: string,
}

const scList: {
	danmu: any,
	price: string,
	name: string,
	uid: string,
}[] = [];

// tool 弹出层
export const LiveToolPopup = () => {
	const [messageApi, contextHolder] = message.useMessage(getMessageConfig(`#${TOOL_ID}`));
	const [roomid, setRoomid] = useState<number>(undefined);
	const [screenshotData, setScreenshotData] = useState<string>('');
	const [roomInfo, setRoomInfo] = useState<any>({});
	const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
	const [userCoverModalOpen, setUserCoverModalOpen] = useState(false);
	const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
	const [scListModalOpen, setScListModalOpen] = useState(false);
	const [wheelbarrowModalOpen, setWheelbarrowModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [liveShield, setLiveShield] = useStorage('liveShield', {});
	const [onlineNum, setOnlineNum] = useState(0);
	const [onlineNumShow, setOnlineNumShow] = useState(true);
	const [scL, setScL] = useState([]);

	const getRoomId = () => {
		if (location.pathname.startsWith('/blanc')) {
			return parseInt(location.pathname.slice(7), 10);
		}
		return parseInt(location.pathname.slice(1), 10);
	};

	// sclist监听事件
	const onScListMutation: MutationCallback = useCallback((mutationsList) => {
		mutationsList.forEach((item) => {
			item.addedNodes.forEach((i: HTMLElement) => {
				if (i.className.indexOf('superChat-card-detail') !== -1 && !isUndefined(i.dataset.danmaku)) {
					scList.push({
						danmu: i.dataset.danmaku,
						price: i.querySelector('.card-item-top-right')?.innerHTML ?? '未发现价格',
						name: i.querySelector('.name').innerHTML,
						uid: i.dataset.uid,
					});
					setScL([...scL, i.dataset.danmaku]);
				}
			});
		});
	}, []);

	useEffect(() => {
		setRoomid(getRoomId());
		// 插入直播屏蔽css
		const shieldStyle = document.createElement('style');
		shieldStyle.id = 'tun-shield-style';
		document.body.appendChild(shieldStyle);
	}, []);

	useMutationObservable(document.querySelector('#chat-items'), onScListMutation);

	useEffect(() => {
		form.setFieldsValue(liveShield);
		injectShieldStyle(liveShield);
	}, [liveShield]);

	// 更新在线活跃人数
	const updateOnlineNum = async (props: { ruid: number; roomId: number; page: number; pageSize: number; }) => {
		try {
			const data = await API.getOnlineGoldRank(props);
			setOnlineNum(data.data.onlineNum);
			return data.data;
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
					const onlineData = await updateOnlineNum({
						ruid: data.data.uid,
						roomId: data.data.room_id,
						page: 1,
						pageSize: 1,
					});
					if (onlineData.OnlineRankItem?.length !== 0) {
						updateOnlineNumId = setInterval(() => {
							updateOnlineNum({
								ruid: data.data.uid,
								roomId: data.data.room_id,
								page: 1,
								pageSize: 1,
							});
						}, 60000);
					} else {
						setOnlineNumShow(false);
					}
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
				messageApi.error('主播未开播, 无法截图');
			}
		} catch (error) {
			messageApi.error('发生错误, 请刷新页面');
		}
	};

	const screenModalCancel = () => {
		setScreenshotModalOpen(false);
	};

	const onCopyScreenshotBtnClicked = () => {
		try {
			Tool.copyImg(screenshotData ?? '');
			messageApi.success('复制成功');
		} catch (error) {
			messageApi.error('复制失败');
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
			messageApi.success('复制成功');
		} catch (error) {
			messageApi.error('复制失败');
			console.error(error);
		}
	};

	// 直播背景
	const backgroundBtnClick = () => {
		setBackgroundModalOpen(true);
	};

	const backgroundModalCancel = () => {
		setBackgroundModalOpen(false);
	};

	const onCopyBackgroundBtnClicked = () => {
		try {
			Tool.copyImg(roomInfo.background ?? '');
			messageApi.success('复制成功');
		} catch (error) {
			messageApi.error('复制失败');
			console.error(error);
		}
	};

	// 直播间分享
	const shareLiveRoom = () => {
		const upName = document.querySelector('.room-owner-username').innerHTML;
		const copyText = `【${roomInfo.title}】\nup主: ${upName}\n直播间链接: https://live.bilibili.com/${roomInfo.room_id}`;
		try {
			Tool.copyDataToClipboard(copyText);
			messageApi.success('复制成功');
		} catch (error) {
			console.error(error);
			messageApi.error('复制失败');
		}
	};

	// sc列表
	const scListBtnClick = () => {
		setScListModalOpen(true);
	};

	const scListModalCancel = () => {
		setScListModalOpen(false);
	};

	// 独轮车弹出层
	const wheelbarrowBtnClick = () => {
		setWheelbarrowModalOpen(true);
	};

	const wheelbarrowModalCancel = () => {
		setWheelbarrowModalOpen(false);
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
			style: '#my-dear-haruna-vm {display:none !important;}',
		},
		{
			name: 'fansMedal',
			label: '粉丝勋章',
			style: '.chat-item .fans-medal-item-ctnr,.chat-item .title-label {display:none !important;}',
		},
		{
			name: 'gift',
			label: '礼物信息',
			style: '.chat-item.top3-notice, .chat-item.gift-item, #chat-gift-bubble-vm, #penury-gift-msg, #lottery-gift-toast {display:none !important;}',
		},
		{
			name: 'chatBottom',
			label: '聊天栏底部信息',
			style: '#brush-prompt, #welcome-area-bottom-vm {display:none !important;} .chat-history-panel .chat-history-list.with-brush-prompt {height: 100% !important;}',
		},
		{
			name: 'emoticon-chat',
			label: '表情(聊天栏)',
			style: '.chat-emoticon, .emoji-animation-area {display:none !important;}',
		},
		{
			name: 'emoticon-danmu',
			label: '表情(弹幕)',
			style: '.danmaku-item-container .danmaku-emoji img {display:none !important;}',
		},
		{
			name: 'systemMsg',
			label: '系统公告',
			style: '.chat-item.system-msg, .chat-item.convention-msg, .hot-rank-msg, .chat-item.common-danmuku-msg{display:none !important;}',
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
			{contextHolder}
			<Space style={{ width: '100%' }} direction="vertical">
				{/* 在线活跃人数 */}
				{
					onlineNumShow ? <PopupTitle style={{ marginTop: '8px' }}>在线活跃人数: {onlineNum}</PopupTitle> : null
				}
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
								<Button onClick={backgroundBtnClick}>直播背景</Button>
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
					<Col span={8}>
						<Button style={{ width: '88px' }} onClick={wheelbarrowBtnClick}>独轮车</Button>
						<WheelbarrowModal
							centered
							width={720}
							title={'独轮车'}
							roomid={roomInfo.room_id}
							open={wheelbarrowModalOpen}
							onCancel={wheelbarrowModalCancel}
							footer={null}
							getContainer={
								document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
							}
						></WheelbarrowModal>
					</Col>
					<Col span={8}>
						<Button style={{ width: '88px' }} onClick={scListBtnClick}>SC 列表</Button>
						<ScListModal
							centered
							width={720}
							title={'直播SC列表(自直播页面开启时开始统计, 非整场直播SC)'}
							scList={scList}
							open={scListModalOpen}
							onCancel={scListModalCancel}
							footer={null}
							getContainer={
								document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
							}
						></ScListModal>
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
