import React from 'react';
import { Form, Switch } from 'antd';
import { useStorage } from '@plasmohq/storage/hook';

export const OtherSetting = () => {
	const [showSameFollowings, setShowSameFollowings] = useStorage('showSameFollowings', false);
	return (
		<Form
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
				label={'是否开启查询共同关注'}
				name={'isVideoLoop'}
			>
				<Switch
					checked={showSameFollowings}
					onChange={(checked) => {
						setShowSameFollowings(checked);
					}}
				></Switch>
			</Form.Item>
		</Form>
	);
};
