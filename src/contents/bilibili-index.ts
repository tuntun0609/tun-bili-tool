import type { PlasmoContentScript } from 'plasmo';

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
// chrome.runtime.sendMessage(
// {
//   type: 'getDataFromStorage',
//   keys: ['isIndex'],
// },
//   (response) => {
//     if (response.isIndex) {
//       let body = document.body;
//       let styleDom = document.createElement('style');
//       styleDom.id = 'tuntun-bilibili-index'
//       styleDom.innerHTML = styleStr;
//       body.appendChild(styleDom);
//     }
//   }
// );

const {body} = document;
const styleDom = document.createElement('style');
styleDom.id = 'tuntun-bilibili-index';
styleDom.innerHTML = styleStr;
body.appendChild(styleDom);
