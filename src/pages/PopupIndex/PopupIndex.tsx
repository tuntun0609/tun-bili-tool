import React, { useEffect, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';

import { API } from '../../utils';

export const PopupIndex: React.FC = () => {
	const [videoList, setVideoList] = useState<any[]>([]);
	const [page, setPage] = useState(0);
	const getVideoList = async () => {
		try {
			const data = await API.getRecommendVideo(page);
			setPage(page + 1);
			setVideoList(videoList.concat(data?.data?.item));
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		getVideoList();
	}, []);
	return (
		<div>
			{
				videoList.map(item => (
					<div key={item.cid}>{item.title}:{item.bvid}</div>
				))
			}
		</div>
	);
};
