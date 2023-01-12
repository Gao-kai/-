import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 导入singleSpaVue包
import singleSpaVue from "single-spa-vue";

Vue.config.productionTip = false;

/* new Vue({
  router,
  render: h => h(App)
}).$mount('#app') */

// 构建子应用配置对象
const appOptions = {
  el: "#vue", // 子应用要挂载到父应用下的哪一个标签上
  router,
  render: (h) => {
    return h(App);
  },
};

// 生成vueLifecycles 对象,需要传入Vue和固定属性appOptions
const vueLifecycles = singleSpaVue({
  Vue,
  appOptions,
});

console.log("vueLifecycles", vueLifecycles);

// 如果父应用引用了我这个子应用 那么window上会有一个属性singleSpaNavigate
if (window.singleSpaNavigate) {
  // 在动态加载路由资源的时候，请加上这个固定的域名前缀
  __webpack_public_path__ = "http://localhost:9999/";
}

// 如果父应用没有引用这个子应用 那么还需要子应用可以独立进行开发
if (!window.singleSpaNavigate) {
  delete appOptions.el;
  new Vue(appOptions).$mount('#app');
}

// 从vueLifecycles中解构出子应用挂载父应用需要的三个生命周期方法,协议接入，这些方法会供父应用进行调用
export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
