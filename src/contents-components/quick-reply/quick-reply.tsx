import { useState } from 'react';
import { Button, List, Modal, Input, message } from 'antd';
import { useStorage } from '@plasmohq/storage/hook';

import { PopupTitle } from '~contents-components';
import { TOOL_ID, getMessageConfig } from '~utils';
const { TextArea } = Input;

export const QuickReply = () => {
	const [messageApi, contextHolder] = message.useMessage(getMessageConfig(`#${TOOL_ID}`));
	const [quickReplyData, setQuickReplyData] = useStorage<string[]>('quickReplyData', []);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [addReplyText, setAddReplyText] = useState('');
	const [editText, setEditText] = useState('');
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editIndex, setEditIndex] = useState(-1);

	const onEditListItem = (msg: string, index: number) => {
		setEditText(msg);
		setEditIndex(index);
		setEditModalOpen(true);
	};
	const onDeleteListItem = (msg: string) => {
		setQuickReplyData(quickReplyData.filter(item => item !== msg));
	};
	const onSendReply = (msg: string) => {
		try {
			const textarea: HTMLTextAreaElement = document.querySelector('#comment .main-reply-box textarea');
			const sendBtn: HTMLDivElement = document.querySelector('#comment .reply-box-send');
			if (textarea && sendBtn) {
				textarea.value = msg;
				textarea.dispatchEvent(new InputEvent('input'));
				setTimeout(() => sendBtn.click(), 50);
			}
			messageApi.success('发送成功');
		} catch (error) {
			message.error('发送失败');
		}
	};
	const onAddReply = () => {
		if (quickReplyData.indexOf(addReplyText) === -1) {
			setQuickReplyData([...quickReplyData, addReplyText]);
			setAddReplyText('');
			setAddModalOpen(false);
		} else {
			messageApi.error('添加项已经存在');
		}
	};
	const onAddReplyTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		setAddReplyText(e.target.value);
	};
	const onEditTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		setEditText(e.target.value);
	};
	const onEditText = () => {
		try {
			const changedReplyData = [...quickReplyData];
			changedReplyData[editIndex] = editText;
			setQuickReplyData(changedReplyData);
			setEditModalOpen(false);
			messageApi.success('编辑完成');
		} catch (error) {
			messageApi.error('编辑失败');
		}
	};
	return (
		<>
			{contextHolder}
			<PopupTitle
				extra={<Button onClick={() => setAddModalOpen(true)} size={'small'}>添加新项</Button>}
			>
				快速评论
			</PopupTitle>
			<div style={{
				height: '150px',
				overflow: 'auto',
			}}>
				<List
					dataSource={quickReplyData}
					renderItem={(item, index) => (
						<List.Item
							style={{
								padding: '12px 0px',
							}}
							actions={[
								<a key="list-edit" onClick={() => onEditListItem(item, index)}>编辑</a>,
								<a key="list-delete" onClick={() => onDeleteListItem(item)}>删除</a>,
								<a key="list-send" onClick={() => onSendReply(item)}>发送</a>,
							]}
						>
							<div title={item} style={{
								maxWidth: '100px',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
							}}>{item}</div>
						</List.Item>
					)}
				/>
			</div>
			<Modal
				destroyOnClose
				centered
				width={720}
				title={'添加新项'}
				cancelText={'返回'}
				okText={'添加'}
				open={addModalOpen}
				onCancel={() => setAddModalOpen(false)}
				onOk={onAddReply}
				getContainer={
					document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
				}
			>
				<TextArea
					onKeyDown={e => e.stopPropagation()}
					autoSize={{ minRows: 3 }}
					onChange={onAddReplyTextChange}
				></TextArea>
			</Modal>
			<Modal
				destroyOnClose
				centered
				width={720}
				title={'编辑'}
				cancelText={'返回'}
				okText={'编辑完成'}
				open={editModalOpen}
				onCancel={() => setEditModalOpen(false)}
				onOk={onEditText}
				getContainer={
					document.querySelector('#tun-tool-popup').shadowRoot.querySelector('#plasmo-shadow-container') as HTMLElement
				}
			>
				<TextArea
					value={editText}
					onKeyDown={e => e.stopPropagation()}
					autoSize={{ minRows: 3 }}
					onChange={onEditTextChange}
				></TextArea>
			</Modal>
		</>
	);
};
