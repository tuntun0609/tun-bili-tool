import React from 'react';
import { useStorage } from '@plasmohq/storage/hook';
import { Form, Switch } from 'antd';

export const MainSetting: React.FC = () => {
	const [isTwoRow, setIsTwoRow] = useStorage('isTwoRow', false);
	const [livingList, setLivingList] = useStorage('isLivingList', false);
	const [isIndexDark, setIsIndexDark] = useStorage('isIndexDark', false);
	const [isHomeRecRepaint, setIsHomeRecRepaint] = useStorage('isHomeRecRepaint', false);
	const [isCloseHomeFullScreenPreview, setIsCloseHomeFullScreenPreview] = useStorage('isCloseHomeFullScreenPreview', false);
	const [form] = Form.useForm();

	return (
		<>
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
					label={'是否开启动态首页双列展示'}
					name={'isTwoRow'}
				>
					<Switch
						checked={isTwoRow}
						onClick={(checked) => {
							setIsTwoRow(checked);
						}}
					></Switch>
				</Form.Item>
				<Form.Item
					label={'是否开启【正在直播】列表加强版'}
					name={'isLivingList'}
				>
					<Switch
						checked={livingList}
						onClick={(checked) => {
							setLivingList(checked);
						}}
					></Switch>
				</Form.Item>
				<Form.Item
					label={'是否开启动态首页暗黑模式'}
					name={'isIndexDark'}
				>
					<Switch
						checked={isIndexDark}
						onClick={(checked) => {
							setIsIndexDark(checked);
						}}
					></Switch>
				</Form.Item>
				<Form.Item
					label={'是否开启首页推荐视频布局优化'}
					name={'isHomeRecRepaint'}
				>
					<Switch
						checked={isHomeRecRepaint}
						onClick={(checked) => {
							setIsHomeRecRepaint(checked);
						}}
					></Switch>
				</Form.Item>
				<Form.Item
					label={'是否关闭首页视频全屏预览'}
					name={'isCloseHomeFullScreenPreview'}
				>
					<Switch
						checked={isCloseHomeFullScreenPreview}
						onClick={(checked) => {
							setIsCloseHomeFullScreenPreview(checked);
						}}
					></Switch>
				</Form.Item>
			</Form>
		</>
	);
};
