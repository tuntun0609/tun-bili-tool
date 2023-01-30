import React, { useState } from 'react';
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import { Avatar, Button, List, message, Modal } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { useStorage } from '@plasmohq/storage/hook';

import { API, getMessageConfig } from '~utils';
import { ThemeProvider } from '~contents-components';

import css from 'data-text:./ShowSameFollowings.scss';
import antdResetCssText from 'data-text:antd/dist/reset.css';

export const config: PlasmoCSConfig = {
	matches: ['*://space.bilibili.com/*'],
};

// 获取挂载节点
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => (
	document.querySelector('#navigator .n-inner .n-statistics')
);

export const watchOverlayAnchor = (
	updatePosition: () => void,
) => {
	setInterval(() => {
		updatePosition();
	}, 100);
};

const HOST_ID = 'tun-same-followings';

// shadow节点id名
export const getShadowHostId = () => HOST_ID;

export const getStyle = () => {
	const style = document.createElement('style');
	style.textContent = antdResetCssText + css;
	return style;
};

enum Attribute {
	'未关注' = 0,
	'已关注' = 2,
	'已互粉' = 6,
}

const ShowSameFollowings = () => {
	const [showSameFollowings] = useStorage('showSameFollowings', false);
	const [modalOpen, setModalOpen] = useState(false);
	const [followingsList, setFollowingsList] = useState([]);
	const [total, setTotal] = useState(0);
	const [messageApi, contextHolder] = message.useMessage(getMessageConfig(`#${HOST_ID}`));

	const mid = parseInt(location.pathname.slice(1), 10);

	const updateList = async (pn = 1) => {
		const followingsList = await API.getSameFollowings({
			mid,
			ps: 10,
			pn,
		});
		if (followingsList?.code === 0) {
			setTotal(followingsList?.data?.total ?? 0);
			setFollowingsList(followingsList?.data?.list ?? []);
		}
		return followingsList?.code;
	};

	const sameFollowingsBtnClick = async () => {
		try {
			const code = await updateList();
			if (code === 0) {
				setModalOpen(true);
			} else if (code === 22115) {
				messageApi.error('该用户已设置关注列表不可见');
			} else if (code === -101) {
				messageApi.error('请先登录');
			} else {
				messageApi.error('查询共同关注出错');
			}
		} catch (error) {
			messageApi.error('查询共同关注出错');
		}
	};
	const onPageChange = async (page: number) => {
		try {
			await updateList(page);
		} catch (error) {
			messageApi.error('查询共同关注出错');
		}
	};
	return (
		showSameFollowings ?
			<ThemeProvider>
				<StyleProvider container={document.querySelector(`#${HOST_ID}`).shadowRoot}>
					<>
						{contextHolder}
						<div
							style={{
								width: '72px',
								height: '66px',
								display: 'flex',
								alignItems: 'center',
								color: '#99a2aa',
								fontSize: '14px',
								zIndex: 100,
								marginRight: '10px',
							}}
						>
							<Button
								size={'small'}
								onClick={sameFollowingsBtnClick}
							>
								共同关注
							</Button>
							<Modal
								destroyOnClose
								centered
								title={`共同关注总数: ${total}`}
								open={modalOpen}
								onCancel={() => setModalOpen(false)}
								footer={null}
								getContainer={
									document.querySelector(`#${HOST_ID}`).shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
								}
							>
								<List
									dataSource={followingsList}
									pagination={{
										total: total,
										pageSize: 10,
										showSizeChanger: false,
										hideOnSinglePage: true,
										onChange: onPageChange,
									}}
									renderItem={item => (
										<List.Item
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<Avatar src={item?.face} />
												<a
													style={{
														marginLeft: '8px',
														fontSize: '14px',
													}}
													href={`https://space.bilibili.com/${item?.mid}`}
													target={'_blank'}
													rel="noreferrer"
												>{item?.uname}</a>
											</div>
											<div
												style={{
													fontSize: '14px',
												}}
											>{item?.attribute !== 2 ? Attribute[item?.attribute] : ''}</div>
										</List.Item>
									)}
								>

								</List>
							</Modal>
						</div>
					</>
				</StyleProvider>
			</ThemeProvider>
			: null
	);
};

export default ShowSameFollowings;
