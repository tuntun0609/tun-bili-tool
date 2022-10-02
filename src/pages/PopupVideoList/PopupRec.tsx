import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PopupVideoItem } from '../../components';
import { API } from '../../utils';

import './PopupVideoList.scss';

export const PopupRec: React.FC = () => {
	const [videoList, setVideoList] = useState<any[]>([]);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const getVideoList = async () => {
		try {
			const data = await API.getRecommendVideo(page);
			setPage(page + 1);
			setVideoList(videoList.concat(
				data?.data?.item?.filter(
					(item: { cid: number; }) => (
						item.cid !== 0
					),
				)));
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
		// getVideoList();
		loadMoreData();
	}, []);
	return (
		<div className='popup-index' id='videoScrollableDiv'>
			<InfiniteScroll
				dataLength={videoList.length}
				next={loadMoreData}
				hasMore={true}
				loader={'加载中'}
				scrollableTarget="videoScrollableDiv"
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
				}}
			>
				{
					videoList.map(item => (
						<PopupVideoItem data={item} key={item.cid}></PopupVideoItem>
					))
				}
			</InfiniteScroll>
		</div>
	);
};
