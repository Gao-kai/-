import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false

// 导入qiankun框架中暴露出来的注册应用和启动应用的方法
import { registerMicroApps, start } from 'qiankun';

/* 
  注册子应用
  1. 名称name
  2. entry 默认加载html 解析里面的js文件进行动态的执行 所以不需要我们想single-spa一样手写加载动态脚本的方法了
  3. 容器container
  4. 激活规则activeRule 基于不同的路由加载不同的子应用
  5. props传递参数
*/
registerMicroApps([
  {
    name: 'vueApp',
    entry: '//localhost:10000', // 是基于fetch进行加载资源的 所以子应用需要解决跨域问题
    container: '#vue',
    activeRule: '/vue',
    props:{
      name:'lilei'
    }
  },
  {
    name: 'reactApp',
    entry: '//localhost:20000',
    container: '#react',
    activeRule: '/react',
    props:{
      age:'18'
    }
  },
  
]);

// 启动基座 
start({
  prefetch:false
});

// 挂载主应用
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
