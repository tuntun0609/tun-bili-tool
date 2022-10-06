import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PopupDynVideoItem, InfiniteScrollLoader, NotLogin } from '../../components';
import { API } from '../../utils';

export const PopupDynHome: React.FC = () => {
	const [videoList, setVideoList] = useState<any[]>([]);
	const [login, setLogin] = useState(true);
	const [page, setPage] = useState(1);
	const [offset, setOffset] = useState<string>(undefined);
	const [loading, setLoading] = useState(false);
	const getVideoList = async () => {
		try {
			const data = await API.getDynVideo(page, offset);
			if (data.code === -101 && data.message === '账号未登录') {
				setLogin(false);
				return;
			}
			setPage(page + 1);
			setVideoList(videoList.concat(data?.data?.items ?? []));
			setOffset(data?.data?.offset);
		} catch (error) {
			console.error(error);
		}
	};
	const loadMoreData = async () => {
		if (loading) {
			return;
		}
		setLoading(true);
		try {
			await getVideoList();
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadMoreData();
	}, []);
	return (
		<div className='popup-list' id='dynVideoScrollableDiv'>
			{login
				? <InfiniteScroll
					dataLength={videoList.length}
					next={loadMoreData}
					hasMore={true}
					loader={<InfiniteScrollLoader />}
					scrollableTarget="dynVideoScrollableDiv"
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						alignContent: 'flexStart',
						overflow: 'visible',
					}}
				>
					{
						videoList.map(item => (
							<PopupDynVideoItem
								key={item.id_str}
								data={item}
							></PopupDynVideoItem>
						))
					}
				</InfiniteScroll>
				: <NotLogin />}
		</div>
	);
};
