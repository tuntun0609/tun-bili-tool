import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PopupDynVideoItem } from '../../components';
import { API } from '../../utils';

export const PopupDynHome: React.FC = () => {
	const [videoList, setVideoList] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [offset, setOffset] = useState<string>(undefined);
	const [loading, setLoading] = useState(false);
	const getVideoList = async () => {
		try {
			const data = await API.getDynVideo(page, offset);
			setPage(page + 1);
			setVideoList(videoList.concat(data?.data?.items));
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
			<InfiniteScroll
				dataLength={videoList.length}
				next={loadMoreData}
				hasMore={true}
				loader={'加载中'}
				scrollableTarget="dynVideoScrollableDiv"
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
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
		</div>
	);
};
