/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Button } from 'antd';

import { ImageModal } from '~components';
import { Tool as tool, API } from '~utils';

export const ToolPopup = () => {
	const [picBtnLoading, setPicBtnLoading] = useState(false);
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [videoPic, setVideoPic] = useState('');

	const onPicBtnClicked = async () => {
		setPicBtnLoading(true);
		const path = location.pathname;
		const [bvId] = path.match(/(BV|bv).{10}/);
		try {
			const videoInfo = await API.getVideoInfo(bvId);
			setVideoPic(videoInfo.pic);
			setPicBtnLoading(false);
			setImageModalOpen(true);
		} catch (error) {
			console.log(error);
		}
	};

	const imageModalCancel = () => {
		setImageModalOpen(false);
	};

	const onCopyImgBtnClicked = async () => {
		try {
			tool.copyImg(videoPic);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='tun-popup-main'>
			<Button onClick={onPicBtnClicked} loading={picBtnLoading}>视频封面</Button>
			<ImageModal
				centered
				width={720}
				title={'视频封面'}
				src={videoPic}
				cancelText={'返回'}
				okText={'复制图片至剪切板'}
				visible={imageModalOpen}
				onCancel={imageModalCancel}
				onOk={onCopyImgBtnClicked}
				getContainer={
					document.querySelector('#tun-tool-popup').shadowRoot.querySelector('.tun-tool-main') as HTMLElement
				}
			></ImageModal>
		</div>
	);
};
