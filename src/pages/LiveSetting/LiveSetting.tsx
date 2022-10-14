import React, { useEffect } from 'react';
import { useStorage, Storage } from '@plasmohq/storage';
import { Button, Form, message, Select, Switch } from 'antd';

const { Option } = Select;
const storage = new Storage();

export const LiveSetting: React.FC = () => {
	const [liveTool, setLiveTool] = useStorage('isLiveTool', false);
	const [liveDefaultQuality, setLiveDefaultQuality] = useStorage('liveDefaultQuality', '不开启');
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldValue('liveDefaultQuality', liveDefaultQuality);
	}, [liveDefaultQuality]);

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
		</Form>
	);
};
