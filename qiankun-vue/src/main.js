import Vue from 'vue'
import App from './App.vue'
import router from './router'

/* 
  子应用渲染逻辑
  qiankun是将子应用生成自己的html页面
  然后在主应用中像加载iframe一样加载html文件
 */
let instance = null;
function render(props = {}){
  // 主应用会传递一些默认的参数给子应用 其中就包括子应用要挂载的容器dom元素
  const { container } = props;
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}


// 如果当前子应用在qiankun框架中被父应用使用 那么__POWERED_BY_QIANKUN__ 属性值为true
if(window.__POWERED_BY_QIANKUN__){
  // 不用像single-spa必须制定一个固定的加载路径：__webpack_public_path__ = "http://localhost:9999/";
  // qiankun是动态生成要加载的脚本路径
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// 子应用独立加载运行时
if(!window.__POWERED_BY_QIANKUN__){
  render();
}

/* 
  子应用要挂载 必须导出三个函数 函数执行必须返回Promise 
*/
export async function bootstrap(props) {
  console.log('[vue] vue子应用启动中');
}


export async function mount(props) {
  console.log('[vue] vue子应用挂载中，父应用传递的参数为', props);
  // 将父应用传递的参数props通过render方法传递给子应用
  render(props);
}


export async function unmount() {
  // 手动销毁实例
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}