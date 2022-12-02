export const videoWrapShieldCss = [
	{
		value: 'like',
		style: '.bpx-player-popup-three, .bpx-player-popup-animate, .bpx-player-popup-follow, .bpx-player-popup-cyc {display:none !important;}',
	},
	{
		value: 'link',
		style: '.bpx-player-link {display:none !important;}',
	},
	{
		value: 'vote',
		style: '.bpx-player-popup-vote, .bpx-player-popup .bpx-player-popup-dm-close {display:none !important;}',
	},
	{
		value: 'score',
		style: '.bpx-player-score {display:none !important;}',
	},
	{
		value: 'reserve',
		style: '.bpx-player-reserve {display:none !important;}',
	},
	{
		value: 'top-left-follow',
		style: '.bpx-player-top-left-follow {display:none !important;}',
	},
];

// 视频卡片屏蔽配置项
export const videoWrapShieldCheckboxOptions = [
	{
		label: '点赞投币收藏卡片',
		value: 'like',
	},
	{
		label: '关联视频卡片',
		value: 'link',
	},
	{
		label: '投票卡片',
		value: 'vote',
	},
	{
		label: '评分卡片',
		value: 'score',
	},
	{
		label: '预约卡片',
		value: 'reserve',
	},
	{
		label: '左上角关注按钮',
		value: 'top-left-follow',
	},
];
