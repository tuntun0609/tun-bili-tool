import type { PlasmoContentScript } from 'plasmo'

export const config: PlasmoContentScript = {
  matches: ['*://t.bilibili.com/*']
}

import '../css/show-all-liver.css';

const API = {
  // 封装get方法
  Get: async (props) => {
    const { url: baseUrl, params = {} } = props;
    let pStr = Object.keys(params).map((key) => {
      return `${key}=${params[key]}`;
    }).join('&');
    let url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
    try {
      let res = await fetch(url, {
        credentials: "include"
      });
      return (await res.json()).data;
    } catch (error) {
      console.error('Get Error', error);
    }
  },
  // 通过关键词获取视频数据
  getLiver: async (num = 0) => {
    try {
      let params = {};
      if (num !== 0) {
        params = {
          size: num
        }
      }
      let res = await API.Get({
        url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users',
        params,
      });
      return res;
    } catch (error) {
      console.log('getLiver', error);
    }
  },
  getCard: async (mid) => {
    try {
      let res = await API.Get({
        url: 'https://api.bilibili.com/x/web-interface/card',
        params: {
          mid,
          photo: 'true',
        },
      });
      return res;
    } catch (error) {
      console.log('getCard', error);
    }
  }
}

const Tool = {
  // 大数转万
  formatBigNumber: (num) => {
    return num > 10000 ? `${(num / 10000).toFixed(2)}万` : num;
  },
  // 字符串转DOM
  s2d: (string: string) => {
    return new DOMParser().parseFromString(string, 'text/html').body
      .childNodes[0];
  },
}

const getListItemTemplete = (prop) => {
  return `
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
  `
}

const init = async (isReflash = false) => {
  let firstGet = await API.getLiver();
  let liverNum = firstGet.count;
  if (isReflash || liverNum > 10) {
    let liveUpListDom = document.querySelector('.bili-dyn-live-users__body');
    if (liveUpListDom) {
      liveUpListDom.innerHTML = '';
      let allLiver = await API.getLiver(liverNum);
      // let addLiverItem = allLiver.items.slice(10);
      allLiver.items.forEach(item => {
        if (liveUpListDom !== null) {
          liveUpListDom.appendChild(Tool.s2d(getListItemTemplete(item)));
        }
      });
      document.querySelector('.bili-dyn-live-users__title span').innerHTML = `(${allLiver.items.length})`
    }
  }
}

const addRefleshBtn =  () => {
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
    }
    refleshBtn.onmouseout  = () => {
      refleshBtn.style.color = '#99a2aa';
    }
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener(
  'load',
  async () => {
    await init();
    addRefleshBtn();
  },
);
