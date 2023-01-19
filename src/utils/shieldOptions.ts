export const videoWrapShieldCss = [
	{
		label: '点赞投币收藏卡片',
		value: 'like',
		style: '.bili-guide {display:none !important;}',
	},
	{
		label: '关联视频卡片',
		value: 'link',
		style: '.bili-link {display:none !important;}',
	},
	{
		label: '投票卡片',
		value: 'vote',
		style: '.bili-vote {display:none !important;}',
	},
	{
		label: '评分卡片',
		value: 'score',
		style: '.bili-score {display:none !important;}',
	},
	{
		label: '预约卡片',
		value: 'reserve',
		style: '.bili-reserve {display:none !important;}',
	},
	{
		label: '左上角关注按钮',
		value: 'top-left-follow',
		style: '.bpx-player-top-left-follow {display:none !important;}',
	},
];

export interface LiveShieldItem {
	name: string | number,
	label?: string | number,
	style?: string,
}

export const liveShieldCss: LiveShieldItem[] = [
	{
		name: 2233,
		label: '2233娘',
		style: '#my-dear-haruna-vm {display:none !important;}',
	},
	{
		name: 'fansMedal',
		label: '粉丝勋章',
		style: '.chat-item .fans-medal-item-ctnr,.chat-item .title-label {display:none !important;}',
	},
	{
		name: 'gift',
		label: '礼物信息',
		style: '.chat-item.top3-notice, .chat-item.gift-item, #chat-gift-bubble-vm, #penury-gift-msg, #lottery-gift-toast {display:none !important;}',
	},
	{
		name: 'chatBottom',
		label: '聊天栏底部信息',
		style: '#brush-prompt, #welcome-area-bottom-vm {display:none !important;} .chat-history-panel .chat-history-list.with-brush-prompt {height: 100% !important;}',
	},
	{
		name: 'emoticon-chat',
		label: '表情(聊天栏)',
		style: '.chat-emoticon, .emoji-animation-area {display:none !important;}',
	},
	{
		name: 'emoticon-danmu',
		label: '表情(弹幕)',
		style: '.danmaku-item-container .danmaku-emoji img {display:none !important;}',
	},
	{
		name: 'systemMsg',
		label: '系统公告',
		style: '.chat-item.system-msg, .chat-item.convention-msg, .hot-rank-msg, .chat-item.common-danmuku-msg{display:none !important;}',
	},
	{
		name: 'pk',
		label: 'PK',
		style: '#chaos-pk-vm {display:none !important;}',
	},
	{
		name: 'shop',
		label: '商品提示',
		style: '#shop-popover-vm, .ecommerce-lot-icon {display: none !important;}',
	},
];
