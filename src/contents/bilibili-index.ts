/* eslint-disable no-empty */
import type { PlasmoContentScript } from 'plasmo';
import { Storage } from '@plasmohq/storage';
import html2canvas from 'html2canvas';
// import * as htmlToImage from 'html-to-image';

import { Tool as tool } from '~utils';
import dark from 'data-text:../css/bilibili-index-dark.css';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://t.bilibili.com/*'],
};

const styleStr = `
  .bili-dyn-home--member {
    width: 1524px !important;
  }

  main {
    width: 1272px !important;
  }

  aside[class="right"] {
    display: none !important;
  }

  .most-viewed-panel {
    margin-bottom: 8px !important;
  }

  .bili-dyn-list__items {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: space-between !important;
    width: 100% !important;
  }

  .bili-dyn-list__item {
    width: calc(50% - 4px) !important;
    /* margin-right: 8px !important; */
  }

  .bili-dyn-list__item .bili-dyn-item {
    width: calc(50% - 4px) !important;
    height: calc(100%) !important;
  }

  .bili-dyn-list__notification {
    margin-top: 8px !important;
    flex-basis:100% !important;
  }

  @media screen and (min-width: 1921px) {
    .bili-dyn-home--member {
      width: 1524px !important;
    }
  }

  @media screen and (min-width: 1921px) {
    main {
      width: 1272px !important;;
    }
  }
`;

const obs = () => {
	const target = document.querySelector('.bili-dyn-list__items');
	const config: MutationObserverInit = {
		childList: true,
	};
	// 当观察到变动时执行的回调函数
	const callback: MutationCallback = (mutationsList) => {
		// console.log('mutation');
		for(const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				for (const addNode of mutation.addedNodes) {
					const menuTool = (addNode as HTMLElement).querySelector('.bili-dyn-more__menu');
					// console.dir(menuTool);
					const screenshotBtn = document.createElement('div');
					screenshotBtn.innerText = '动态截图';
					screenshotBtn.style.height = '25px';
					screenshotBtn.style.padding = '2px 0px';
					screenshotBtn.style.textAlign = 'center';
					screenshotBtn.className = 'bili-dyn-more__menu__item';
					screenshotBtn.onclick = async () => {
						screenshotBtn.innerText = '正在截图...';
						try {
							const main = (addNode as HTMLElement).querySelector('.bili-dyn-item__main');
							const isIndexDark = await storage.get('isIndexDark');
							const canvas = await html2canvas(main as HTMLElement, {
								useCORS: true,
								allowTaint: true,
								ignoreElements: e => e.className === 'bili-popover' || e.className === 'bili-dyn-item__footer',
								backgroundColor: isIndexDark ? '#141414' : '#ffffff',
							});
							// const canvas = await htmlToImage.toCanvas(main as HTMLElement, {
							// 	filter: e => e.className !== 'bili-popover',
							// 	backgroundColor: '#fff',
							// });
							canvas.toBlob(async (blob) => {
								const data = [
									new window.ClipboardItem({
										[blob.type]: blob,
									}),
								];
								await tool.copyDataToClipboard(data);
								screenshotBtn.innerText = '复制成功';
								setTimeout(() => {
									screenshotBtn.innerText = '动态截图';
								}, 1500);
							});
						} catch (error) {
							screenshotBtn.innerText = '复制失败';
							setTimeout(() => {
								screenshotBtn.innerText = '动态截图';
							}, 1500);
							console.error(error);
						}
					};
					try {
						menuTool.appendChild(screenshotBtn);
					} catch (error) {
						console.log(error);
					}
				}
			}
		}
	};
	// 创建一个观察器实例并传入回调函数
	const observer = new MutationObserver(callback);
	// 以上述配置开始观察目标节点
	observer.observe(target, config);
};

const init = async () => {
	const isTwoRow = await storage.get('isTwoRow');
	if (isTwoRow) {
		const styleDom = document.createElement('style');
		styleDom.id = 'tuntun-bilibili-index';
		styleDom.innerHTML = styleStr;
		document.body.appendChild(styleDom);
	}
};

const isDark = async () => {
	const isIndexDark = await storage.get('isIndexDark');
	if (isIndexDark) {
		const styleDom = document.createElement('style');
		styleDom.id = 'tuntun-bilibili-index-dark';
		styleDom.innerHTML = dark;
		document.body.appendChild(styleDom);
	}
};

init();
obs();
isDark();

let isReInit = true;
setTimeout(() => {
	const upList = document.querySelectorAll('.bili-dyn-up-list__item');
	const [alldyn] = upList;
	upList.forEach((item: HTMLElement, index) => {
		if (index !== 0) {
			item.addEventListener('click', () => {
				if (isReInit) {
					obs();
					isReInit = false;
				}
			});
		}
	});
	alldyn.addEventListener('click', () => {
		obs();
		isReInit = true;
	});
}, 3000);
