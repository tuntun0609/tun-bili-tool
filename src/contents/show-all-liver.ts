import type { PlasmoContentScript } from 'plasmo';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://t.bilibili.com/*'],
};

import { API, Tool } from '~utils';
import style from 'data-text:../css/show-all-liver.css';

const getListItemTemplete = prop => `
    <div class="bili-dyn-live-users__item">
      <a href="${prop.link}" target="_blank" style="display: flex">
        <div class="bili-dyn-live-users__item__left">
          <div class="bili-dyn-live-users__item__face-container">
            <div class="bili-dyn-live-users__item__face">
              <div class="bili-awesome-img" style="background-image: url(${prop.face.slice(6)}@47w_47h_1c.webp);">
              </div>
            </div>
          </div>
        </div>
        <div class="bili-dyn-live-users__item__right">
          <div class="bili-dyn-live-users__item__uname bili-ellipsis">
            ${prop.uname}
          </div>
          <div class="bili-dyn-live-users__item__title bili-ellipsis">
            ${prop.title}
          </div>
        </div>
      </a>
    </div>
  `;

const init = async (isReflash = false) => {
	const firstGet = await API.getLiver();
	const liverNum = firstGet.count;
	if (isReflash || liverNum > 10) {
		const liveUpListDom = document.querySelector('.bili-dyn-live-users__body');
		if (liveUpListDom) {
			liveUpListDom.innerHTML = '';
			const allLiver = await API.getLiver(liverNum);
			allLiver.items.forEach((item) => {
				if (liveUpListDom !== null) {
					liveUpListDom.appendChild(Tool.s2d(getListItemTemplete(item)));
				}
			});
			document.querySelector('.bili-dyn-live-users__title span').innerHTML = `(${allLiver.items.length})`;
		}
	}
};

// 添加刷新按钮
const addRefleshBtn = () => {
	const header = document.querySelector('.bili-dyn-live-users__header');
	const more = document.querySelector('.bili-dyn-live-users__more');
	const refleshBtn: any = Tool.s2d(`
    <button style="background: white; color: #99a2aa; cursor: pointer; border: #99a2aa;font-size: 12px;">刷新</button>
  `);
	try {
		header.insertBefore(refleshBtn, more);
		refleshBtn.addEventListener('click', async () => {
			refleshBtn.innerHTML = '正在刷新';
			await init(true);
			refleshBtn.innerHTML = '刷新';
		});
		refleshBtn.onmouseover = () => {
			refleshBtn.style.color = '#00a1d6';
		};
		refleshBtn.onmouseout = () => {
			refleshBtn.style.color = '#99a2aa';
		};
	} catch (error) {
		console.log(error);
	}
};

window.addEventListener(
	'load',
	async () => {
		const isLivingList = await storage.get('isLivingList');
		if (isLivingList) {
			const styleDom = document.createElement('style');
			styleDom.id = 'tuntun-bilibili-show-all-liver';
			styleDom.textContent = style;
			document.body.appendChild(styleDom);
			await init();
			addRefleshBtn();
		}
	},
);
