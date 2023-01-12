import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {registerApplication,start} from 'single-spa'

Vue.config.productionTip = false

/* 
  注册要加载的子应用,这样single-spa才知道在什么时机，如何去初始化、下载、挂载和卸载各应用。
  1. name 
  registerApplication的第一个参数表示应用名称，name必须是string类型

  2. Loading Function or Application
  registerApplication的第二个参数可以是一个Promise类型的 加载函数，也可以是一个已经被解析的应用。

  值可以是一个应用：这个应用其实是一个包含各个生命周期函数的对象。我们既可以从另外一个文件中引入该对象，也可以在single-spa的配置文件中定义这个对象。
  值可以是一个函数：这个函数必须是返回promsie的函数或者async function方法 
  这个函数没有入参，会在应用第一次被下载时调用。返回的Promise resolve之后的结果必须是一个可以被解析的应用。
  常见的实现方法是使用import加载：() => import('/path/to/application.js')

  3. 激活函数
  registerApplication的第三个参数需要是一个纯函数，window.location会作为第一个参数被调用，当函数返回的值为真(truthy)值时，应用会被激活。
  通常情况下，Activity function会根据window.location/后面的path来决定该应用是否需要被激活。

  4. 自定义属性
  registerApplication函数可选的第四个参数是 custom props。
  这个参数会传递给 single-spa 的 lifecycle 函数。实现父子的通信。
*/

registerApplication(
  '使用Vue写的子应用',
  async function(){
    console.log('加载函数被触发')

    /* 
      依次加载子应用打包后的lib文件 
      1. 先加载公共的 
      2. 后加载app.js
    */
    await loadScript("http://localhost:9999/js/chunk-vendors.js");
    await loadScript("http://localhost:9999/js/app.js");

    /* 
      子应用的脚本加载完成之后
      全局的window上已经挂载了子应用lib导出的全局变量singleSpaVue
      此对象中包含是三个协议函数 bootstrap mount unmount
    */
    console.log('子应用加载的模块',window.singleSpaVue)

    // 将子应用加载的结果返回
    return window.singleSpaVue;
  },
  /* 激活函数 子应用路由匹配成功 此激活函数调用之后就会去加载子应用的脚本 */
  (location) => location.pathname.startsWith('/vue'),
);
start();

/* 脚本加载 */
function loadScript(url){
  return new Promise((resolve,reject)=>{
    let script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  })
}



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
