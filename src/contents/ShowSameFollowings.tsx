/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import type { PlasmoContentScript, PlasmoGetOverlayAnchor } from 'plasmo';
import { Avatar, Button, ConfigProvider, List, message, Modal } from 'antd';
import { useStorage } from '@plasmohq/storage/hook';
import zhCN from 'antd/es/locale/zh_CN';

import { API } from '~utils';

import css from 'data-text:./ShowSameFollowings.scss';
import antdCss from 'data-text:antd/dist/antd.variable.min.css';

ConfigProvider.config({
	theme: {
		primaryColor: '#fb7299',
		successColor: '#52c41a',
		warningColor: '#faad14',
		errorColor: '#f5222d',
	},
});

export const config: PlasmoContentScript = {
	matches: ['*://space.bilibili.com/*'],
};

// 获取挂载节点
export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () => (
	document.querySelector('.n-statistics :first-child')
);

export const watchOverlayAnchor = (
	updatePosition: () => void,
) => {
	setInterval(() => {
		updatePosition();
	}, 100);
};

// shadow节点id名
export const getShadowHostId = () => 'tun-same-followings';

export const getStyle = () => {
	const style = document.createElement('style');
	style.textContent = antdCss + css;
	return style;
};

// 全局message配置
message.config({
	top: 70,
	duration: 1.5,
	maxCount: 3,
	getContainer: () => document.querySelector('#tun-same-followings').shadowRoot.querySelector('#plasmo-shadow-container'),
});

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
	const mid = parseInt(location.pathname.slice(1), 10);

	const updateList = async (pn = 1) => {
		const followingsList = await API.getSameFollowings({
			mid,
			ps: 10,
			pn,
		});
		setTotal(followingsList?.data?.total ?? 0);
		setFollowingsList(followingsList?.data?.list ?? []);
	};

	const sameFollowingsBtnClick = async () => {
		try {
			await updateList();
			setModalOpen(true);
		} catch (error) {
			message.error('查询共同关注出错');
		}
	};
	const onPageChange = async (page: number) => {
		try {
			await updateList(page);
		} catch (error) {
			message.error('查询共同关注出错');
		}
	};
	return (
		showSameFollowings ? <ConfigProvider locale={zhCN}>
			<div
				style={{
					position: 'absolute',
					right: '14px',
					width: '72px',
					height: '66px',
					display: 'flex',
					alignItems: 'center',
					color: '#99a2aa',
					fontSize: '14px',
					zIndex: 100,
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
					title={'查询共同关注'}
					open={modalOpen}
					onCancel={() => setModalOpen(false)}
					footer={null}
					getContainer={
						document.querySelector('#tun-same-followings').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
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
		</ConfigProvider>
			: null
	);
};

export default ShowSameFollowings;
