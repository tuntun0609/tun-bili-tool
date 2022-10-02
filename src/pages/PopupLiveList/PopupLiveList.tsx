import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

import { PopupLiveItem } from '../../components';
import { API } from '../../utils';

export const PopupLiveList: React.FC = () => {
	const [liveList, setLiveList] = useState<any[]>([]);
	const [reflash, setReflash] = useState(false);
	const [reflashBtnText, setReflashBtnText] = useState('刷新');
	const getLiveList = async () => {
		try {
			const countData = await API.getLiver(0);
			const data = await API.getLiver(countData?.count ?? 10);
			setLiveList(data.items ?? []);
		} catch (error) {
			console.error(error);
		}
	};
	const onReflash = async () => {
		setReflash(true);
		try {
			await getLiveList();
			setReflash(false);
			setReflashBtnText('已刷新');
			setTimeout(() => {
				setReflashBtnText('刷新');
			}, 1500);
		} catch (error) {
			setReflash(false);
		}
	};
	useEffect(()=> {
		getLiveList();
	}, []);
	return (
		<>
			<div style={{
				padding: '10px',
				fontWeight: 'bold',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}>
				<div>正在直播({liveList.length})</div>
				<Button
					loading={reflash}
					onClick={onReflash}
					size={'small'}
					type={'primary'}
				>{reflashBtnText}</Button>
			</div>
			<div className='popup-list' style={{
				height: 'calc(100vh - 40px - 38px - 42px)',
				display: 'flex',
				justifyContent: 'space-between',
				flexWrap: 'wrap',
			}}>
				{
					liveList.map(item => (
						<PopupLiveItem data={item} key={item.uid} />
					))
				}
			</div>
		</>
	);
};
