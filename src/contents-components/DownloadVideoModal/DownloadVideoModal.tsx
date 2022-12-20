import React, { useEffect, useState } from 'react';
import { Button, Col, message, Modal, ModalProps, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import { isUndefined } from 'lodash';

import { PopupTitle } from '~contents-components';
import { TOOL_ID, getMessageConfig } from '~utils';

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
	const [messageApi, contextHolder] = message.useMessage(getMessageConfig(`#${TOOL_ID}`));
	const [videoDownloadInfo, setVideoDownloadInfo] = useState<any>([]);
	const [audioDownloadInfo, setAudioDownloadInfo] = useState<any>([]);
	const [supportFormats, setSupportFormats] = useState<any>([]);
	const [videoListData, setVideoListData] = useState<VideoListItemType[]>([]);
	const [cid, setCid] = useState<number>(videoInfo.pages?.[0]?.cid ?? 0);
	const [videoSource, setVideoSource] = useState(0);
	const [audioSource, setAudioSource] = useState(0);

	// 获取音频
	const getDownloadInfo = async (bvid: string, cid: number) => {
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

	// 通过浏览器下载视频或音频
	const downloadVideoOrAudioByBrowser = async (info: any, scource?: number) => {
		try {
			const allUrl = [info.baseUrl, ...info.backupUrl];
			const url = allUrl[scource ?? 0] ?? allUrl[0];
			downloadByBrowser(url);
		} catch (error) {
			console.error(error);
			messageApi.error('下载发生错误');
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
						title: item?.part,
						cid: item?.cid,
					})));
					const data = await getDownloadInfo(videoInfo.bvid, cid);
					setVideoDownloadInfo(data.data.data?.dash?.video ?? []);
					setAudioDownloadInfo(data.data.data?.dash?.audio?.sort(
						(a: { id: number; }, b: { id: number; }) => b.id - a.id,
					) ?? []);
					setSupportFormats(data.data.data?.support_formats ?? []);
				}
			} catch (error) {
				messageApi.error('获取下载信息错误');
			}
		};
		main();
	}, [cid]);

	return (
		<>
			{contextHolder}
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
						<PopupTitle style={{ marginRight: '8px' }}>视频下载(不包括音频)</PopupTitle>
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
					</div>
					{/* 不同清晰度视频下载按钮 */}
					<Row
						wrap
						align={'middle'}
						justify={'start'}
						gutter={[8, 8]}
					>
						{
							videoDownloadInfo.map((item: any) => (
								<Col key={`${item?.codecs}-${item?.id}`} span={6}>
									<div style={{ position: 'relative' }}>
										<Button
											block
											onClick={() => {
												downloadVideoOrAudioByBrowser(item, videoSource);
											}}
										>
											<a
												type={item?.mimeType}
												target={'_blank'}
												rel={'noreferrer'}
												title={item?.codecs}
												href={
													[item?.baseUrl, ...(item?.backupUrl ?? [])][videoSource] ?? item.baseUrl
												}
												style={{
													color: '#000',
												}}
											>
												{
													supportFormats.find((i: { quality: number; }) => (
														i.quality === item?.id
													))?.new_description ?? item?.codecs
												}
												<br/>
											</a>
										</Button>
										{item?.id >= 112 ? <VipIcon style={{
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
							audioDownloadInfo.map((item: any) => (
								<Col key={item?.id} span={6}>
									<div style={{ position: 'relative' }}>
										<Button
											block
											onClick={() => {
												downloadVideoOrAudioByBrowser(item, audioSource);
											}}
										>
											<a
												type={item?.mimeType}
												target={'_blank'}
												rel={'noreferrer'}
												href={
													[item?.baseUrl, ...(item?.backupUrl ?? [])][videoSource] ?? item?.baseUrl
												}
												style={{
													color: '#000',
												}}
											>
												{AudioType[item?.id]}
											</a>
										</Button>
									</div>
								</Col>
							))
						}
					</Row>
					<div className='tun-tip' style={{
						marginTop: '8px',
					}}>
						<ol>
							<li>由于网站限制, 视频下载只包括画面不包括音频, 如需完整视频请自行合并 <a target={'_blank'} href='https://www.yuque.com/docs/share/1855fae2-513a-4abb-99d0-9260d26769ca' rel="noreferrer">合并参考</a></li>
							<li>下载慢或者失败时可切换线路</li>
							<li>如果切换线路后依然无法下载, 请<strong>右键按钮</strong>并点击<strong>链接另存为</strong>, 以此来下载内容</li>
							<li>某些文字相同的按钮所下载的视频编码会有所不同, 按钮处悬浮可查看视频编码</li>
							<li>视频与音频下载文件后缀名均为<strong>m4s</strong>, 实际编码为<strong>mp4</strong>, 下载后可更改拓展名为<strong>mp4</strong></li>
						</ol>
					</div>
				</Space>
			</Modal>
		</>
	);
};
