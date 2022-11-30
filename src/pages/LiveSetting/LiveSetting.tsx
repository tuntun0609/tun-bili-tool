import React, { useEffect, useState } from 'react';
import { useStorage, Storage } from '@plasmohq/storage';
import { Button, Form, Input, message, Select, Space, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { API, Tool } from '~utils';

const { Option } = Select;
const storage = new Storage();

interface ListenLiveRoomType {
  key: number,
	name: string,
	roomid: number,
}

export const LiveSetting: React.FC = () => {
	const [liveTool, setLiveTool] = useStorage('isLiveTool', false);
	const [liveDefaultQuality, setLiveDefaultQuality] = useStorage('liveDefaultQuality', '不开启');
	const [form] = Form.useForm();
	const [listenLiveRooms, setListenLiveRooms] = useStorage<ListenLiveRoomType[]>('listenLiveRooms', []);
	const [isListenLiveRoom, setIsListenLiveRoom] = useStorage('isListenLiveRoom', false);
	const [addUid, setAddUid] = useState<string>();
	const [addLoading, setAddLoading] = useState(false);

	useEffect(() => {
		form.setFieldValue('liveDefaultQuality', liveDefaultQuality);
	}, [liveDefaultQuality]);


	const columns: ColumnsType<ListenLiveRoomType> = [
		{
			title: 'uid',
			dataIndex: 'key',
			key: 'key',
			width: '200px',
		},
		{
			title: '名称',
			dataIndex: 'name',
		},
		{
			title: '房间号',
			dataIndex: 'roomid',
			render: roomid => (
				<a
					style={{
						color: '#000',
					}}
					href={`https://live.bilibili.com/${roomid}`}
					target={'_blank'}
					rel={'noreferrer'}
				>{roomid}</a>
			),
		},
		{
			title: '操作',
			width: 160,
			render: (_, userItem) =>
				(
					<Space>
						<Button
							onClick={() => {
								setListenLiveRooms([...listenLiveRooms].filter(item => item.key !== userItem.key));
							}}
						>删除</Button>
						<Button>刷新信息</Button>
					</Space>
				)
			,
		},
	];

	const resetLiveToolPosition = () => {
		try {
			storage.set('liveToolPosition', {
				top: 100,
				right: 100,
			});
			message.success('重置成功');
		} catch (error) {
			message.error('重置失败');
		}
	};

	const liveQualityChange = (value: string) => {
		setLiveDefaultQuality(value);
	};

	const getTableFooter = () => (
		<div style={{
			display: 'flex',
			justifyContent: 'flex-end',
		}}>
			<Space>
				<Input
					placeholder='请输入监听对象uid'
					onChange={(e) => {
						setAddUid(e.target.value);
					}}
				/>
				<Button
					loading={addLoading}
					onClick={async () => {
						if (!addUid) {
							message.error('添加uid不能为空');
							return;
						}
						if (!Tool.isStrNumber(addUid)) {
							message.error('添加uid请输入数字');
							return;
						}
						if (listenLiveRooms.some(item => item.key === parseInt(addUid, 10))) {
							message.error('添加的监听对象已存在');
							return;
						}
						try {
							setAddLoading(true);
							const addUserInfo = await API.getUserInfo(parseInt(addUid, 10));
							console.log(addUserInfo);
							if (!addUserInfo) {
								message.error('不存在该用户');
								return;
							}
							if (!addUserInfo.live_room) {
								message.error('该用户没有直播间');
								return;
							}
							setListenLiveRooms([...listenLiveRooms, {
								key: addUserInfo.mid,
								name: addUserInfo.name,
								roomid: addUserInfo.live_room.roomid,
							}]);
							message.success('添加成功');
						} catch (error) {
							message.error(error);
						} finally {
							setAddLoading(false);
						}
					}}
				>添加</Button>
			</Space>
		</div>
	);

	return (
		<Form
			form={form}
			labelCol={{
				style: {
					minWidth: '250px',
				},
			}}
			labelWrap
			labelAlign={'left'}
			size={'middle'}
		>
			<Form.Item
				label={'是否自动开启直播工具'}
				name={'liveTool'}
			>
				<div>
					<Switch
						checked={liveTool}
						onClick={(checked) => {
							setLiveTool(checked);
						}}
					></Switch>
					<Button
						style={{
							marginLeft: '10px',
						}}
						onClick={resetLiveToolPosition}
					>重置按钮位置</Button>
				</div>
			</Form.Item>
			<Form.Item
				label={'直播默认画质'}
				name={'liveDefaultQuality'}
			>
				<Select
					style={{
						width: '170px',
					}}
					onChange={liveQualityChange}
				>
					<Option value='不开启'>不开启</Option>
					<Option value='原画PRO '>原画PRO</Option>
					<Option value='原画 '>原画</Option>
					<Option value='蓝光PRO '>蓝光PRO</Option>
					<Option value='蓝光 '>蓝光</Option>
					<Option value='超清PRO '>超清PRO</Option>
					<Option value='超清 '>超清</Option>
					<Option value='高清 '>高清</Option>
					<Option value='流畅 '>流畅</Option>
				</Select>
			</Form.Item>
			<Form.Item
				label={'是否开启直播监控'}
			>
				<Switch
					checked={isListenLiveRoom}
					onClick={(checked) => {
						setIsListenLiveRoom(checked);
					}}
				></Switch>
			</Form.Item>
			{
				isListenLiveRoom
					? <Table
						bordered
						style={{
							maxWidth: '800px',
						}}
						footer={getTableFooter}
						columns={columns}
						dataSource={listenLiveRooms}
					></Table>
					: null
			}
		</Form>
	);
};
