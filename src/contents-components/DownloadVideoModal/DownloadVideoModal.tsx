import React, { useEffect, useState } from 'react';
import { Button, Col, message, Modal, ModalProps, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import { isUndefined } from 'lodash';

import { PopupTitle } from '~contents-components';

const { Option } = Select;

interface DownloadVideoModalProps extends ModalProps {
	videoInfo: any,
	onProgress?: (progress: number) => void,
}

// videoList数据源接口
interface VideoListItemType {
  key: number;
  title: string;
	cid: number;
}
// videoList列配置
const videoListColumns: ColumnsType<VideoListItemType> = [
	{
		title: '分P数',
		dataIndex: 'key',
	},
	{
		title: '分P名',
		dataIndex: 'title',
	},
	{
		title: 'cid',
		dataIndex: 'cid',
	},
];
// 视频分p展示组件
export const VideoList = (props: any) => (
	<Table
		{...props}
		pagination={{
			defaultPageSize: 5,
			hideOnSinglePage: true,
		}}
		columns={videoListColumns}
	></Table>
);

// 大会员图标
export const VipIcon = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>) => (
	<i {...props} className='tun-vip-icon'></i>
);

// 音频类型
enum AudioType {
	'64K' = 30216,
	'132K' = 30232,
	'192K' = 30280,
	'杜比全景声' = 30250,
	'Hi-Res无损' = 30251,
}

// 下载视频弹出层
export const DownloadVideoModal = (props: DownloadVideoModalProps) => {
	const { videoInfo } = props;
	const [videoDownloadInfo, setVideoDownloadInfo] = useState<any>({});
	const [audioDownloadInfo, setAudioDownloadInfo] = useState<any>({});
	const [videoListData, setVideoListData] = useState<VideoListItemType[]>([]);
	const [cid, setCid] = useState<number>(videoInfo.pages[0].cid ?? 0);
	const [videoSource, setVideoSource] = useState(0);
	const [audioSource, setAudioSource] = useState(0);

	// 视频下载链接
	const getVideoUrl = async (bvid: string, cid: number, qn?: number) => {
		const data = await axios.get('https://api.bilibili.com/x/player/playurl', {
			params: {
				bvid: bvid,
				cid: cid,
				qn: qn,
				fourk: 1,
			},
			withCredentials: true,
		});
		return data;
	};
	// 获取音频
	const getAudioUrl = async (bvid: string, cid: number) => {
		const data = await axios.get('https://api.bilibili.com/x/player/playurl', {
			params: {
				bvid: bvid,
				cid: cid,
				fourk: 1,
				fnval: 80,
			},
			withCredentials: true,
		});
		return data;
	};
	// 通过axios下载视频方法
	// const downloadByAxios = (url: string, name: string, type: string) => new Promise<void>((resolve, reject) => {
	// 	axios(url, {
	// 		method: 'get',
	// 		responseType: 'blob',
	// 		onDownloadProgress: (evt: any) => {
	// 			if (onProgress !== undefined) {
	// 				const progress = Math.floor(((evt.loaded / evt.total) * 100) * 100) / 100;
	// 				onProgress(progress);
	// 			}
	// 		},
	// 	})
	// 		.then((res) => {
	// 			const blob = new Blob([res.data]);
	// 			const a = document.createElement('a');
	// 			a.download = `${name}.${type}`;
	// 			a.href = URL.createObjectURL(blob);
	// 			a.click();
	// 			URL.revokeObjectURL(a.href);
	// 			a.remove();
	// 			resolve();
	// 		})
	// 		.catch((err) => {
	// 			reject(err);
	// 		});
	// });

	// 通过浏览器下载链接资源
	const downloadByBrowser = (url) => {
		const a = document.createElement('a');
		a.href = url;
		a.target = '__blank';
		a.click();
		a.remove();
	};

	// 通过浏览器下载视频
	const downloadVideoByBrowser = async (qn: number, scource?: number) => {
		try {
			const data = await getVideoUrl(videoInfo.bvid, cid, qn);
			const allUrl = [data.data.data.durl[0].url, ...data.data.data.durl[0].backup_url];
			const url = allUrl[scource ?? 0] ?? allUrl[0];
			downloadByBrowser(url);
		} catch (error) {
			console.error(error);
			message.error('下载发生错误');
		}
	};

	// 通过浏览器下载音频
	const downloadAudioByBrowser = async (info: any, scource?: number) => {
		try {
			const allUrl = [info.baseUrl, ...info.backupUrl];
			console.log(allUrl);
			console.log(scource, allUrl[scource ?? 0] ?? allUrl[0]);
			downloadByBrowser(allUrl[scource ?? 0] ?? allUrl[0]);
		} catch (error) {
			console.error(error);
			message.error('下载发生错误');
		}
	};

	// videoList radio选择事件
	const videoListRowSelection = {
		onChange: (_selectedRowKeys: React.Key[], selectedRows: VideoListItemType[]) => {
			setCid(selectedRows[0].cid);
		},
		getCheckboxProps: (record: VideoListItemType) => ({
			key: record.key,
			title: record.title,
			cid: record.cid,
		}),
	};

	// bvid改变时
	useEffect(() => {
		setCid(videoInfo.cid ?? 0);
	}, [videoInfo]);

	// cid改变
	useEffect(() => {
		const main = async () => {
			try {
				if (!isUndefined(videoInfo.bvid)) {
					// 所有分p视频列表信息
					setVideoListData(videoInfo.pages.map((item: any, i: number) => ({
						key: i + 1,
						title: item.part,
						cid: item.cid,
					})));
					const videoData = await getVideoUrl(videoInfo.bvid, cid);
					const audioData = await getAudioUrl(videoInfo.bvid, cid);
					setVideoDownloadInfo(videoData.data.data ?? {});
					setAudioDownloadInfo(audioData.data.data ?? {});
				}
			} catch (error) {
				message.error('获取下载信息错误');
			}
		};
		main();
	}, [cid]);

	return (
		<Modal
			{...props}
		>
			<Space style={{ width: '100%' }} direction="vertical">
				{/* 分p选择器 */}
				{
					videoListData.length !== 1 ?
						<div style={{ marginBottom: '8px' }}>
							<PopupTitle>选择分P</PopupTitle>
							<VideoList
								size="small"
								rowSelection={{
									type: 'radio',
									...videoListRowSelection,
									defaultSelectedRowKeys: [1],
								}}
								dataSource={videoListData}
							></VideoList>
						</div>
						: null
				}
				{/* 视频下载标题以及线路选择 */}
				<div style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'start',
				}}>
					<PopupTitle style={{ marginRight: '8px' }}>视频下载</PopupTitle>
					<Select
						size={'small'}
						defaultValue={0}
						onChange={value => setVideoSource(value)}
						dropdownStyle={{ zIndex: '9999999999' }}
						getPopupContainer={() => document.querySelector('#tun-tool-popup').shadowRoot as any}
					>
						<Option value={0}>线路1</Option>
						<Option value={1}>线路2</Option>
						<Option value={2}>线路3</Option>
					</Select>
					<PopupTitle style={{ marginLeft: '8px' }}>(下载慢或者失败时可切换线路)</PopupTitle>
				</div>
				{/* 不同清晰度视频下载按钮 */}
				<Row
					wrap
					align={'middle'}
					justify={'start'}
					gutter={[8, 8]}
				>
					{
						videoDownloadInfo.accept_quality?.map((item: number, index: string | number) => (
							<Col key={item} span={6}>
								<div style={{ position: 'relative' }}>
									<Button
										block
										onClick={() => {
											downloadVideoByBrowser(item, videoSource);
										}}
									>{videoDownloadInfo.accept_description[index]}</Button>
									{item >= 112 ? <VipIcon style={{
										position: 'absolute',
										top: '2px',
										left: '2px',
										zIndex: 10,
									}}></VipIcon> : null}
								</div>
							</Col>
						))
					}
				</Row>
				{/* 视频下载标题以及线路选择 */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
					<PopupTitle style={{ marginRight: '8px' }}>音频下载</PopupTitle>
					<Select
						size={'small'}
						defaultValue={0}
						onChange={value => setAudioSource(value)}
						dropdownStyle={{ zIndex: '9999999999' }}
						getPopupContainer={() => document.querySelector('#tun-tool-popup').shadowRoot as any}
					>
						<Option value={0}>线路1</Option>
						<Option value={1}>线路2</Option>
						<Option value={2}>线路3</Option>
					</Select>
				</div>
				{/* 不同清晰度音频下载按钮 */}
				<Row
					wrap
					align={'middle'}
					justify={'start'}
					gutter={[8, 8]}
				>
					{
						audioDownloadInfo.dash?.audio?.map((item: any) => (
							<Col key={item.id} span={6}>
								<div style={{ position: 'relative' }}>
									<Button
										block
										onClick={() => {
											downloadAudioByBrowser(item, audioSource);
										}}
									>{AudioType[item.id]}</Button>
								</div>
							</Col>
						))
					}
				</Row>
			</Space>
		</Modal>
	);
};
