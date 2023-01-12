import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

/* 封装单独渲染逻辑 */
function render(props={}){

  // 为了避免根 id #root 与其他的 DOM 冲突，需要限制查找范围。
  const { container } = props;
  const root = ReactDOM.createRoot(container ? container.querySelector('#root') : document.querySelector('#root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 单独加载react子应用
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// qiankun加载子应用 动态注入加载地址
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

/* 声明导出的三个异步函数 */
export async function bootstrap() {
  console.log('[react16] react子应用启动中');
}

export async function mount(props) {
  console.log('[react16] react子应用挂载，参数为', props);
  render(props);
}

export async function unmount(props) {
  console.log('[react16] react子应用卸载中');
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}