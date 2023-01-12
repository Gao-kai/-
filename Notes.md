## 什么是微前端?



## 为什么要用微前端？
1. 应用大，生产环境下打包构建速度慢，比如改一个小bug也需要重新打包上线部署，浪费时间
2. 项目组成架构大，人员多，组织协同维护越来越冗余

比如以前一个项目中有首页、分类、商品、购买、支付等多个模块，都是运行在一个应用中的。
微前端就是按照项目的实际情况将不同功能模块按照不同的维度进行拆分，拆分成多个小的子应用，不同的团队只负责维护自己的哪一个子应用，然后通过主应用来加载这些子应用。
微前端的核心在于先拆，然后组合。

开发中会遇到的痛点：
1. 不同项目团队中开发者之间应用的技术栈不同，希望开发时用自己熟悉的技术栈进行开发，传统的项目中很难做到一个应用使用多个技术栈进行开发
2. 系统每个团队都可以进行独立开发，独立部署，而不是所有模块都在一个包里
3. 项目中还需要用到的比较老的代码怎么办，这部分代码已经很稳定了，现在你要升级，不能说吧原来的代码全部重构一版，这样太浪费公司的人力物力，我们系统在不破坏现在老代码的前提下进行技术迭代升级

所以微前端就解决了这些问题：
1. 将一个大的应用划分为多个小的子应用
2. 将子应用打包为一个个的独立的lib，解决了技术栈的限制和独立打包部署的限制
3. 当路由切换的时候，浏览器加载不同的lib子应用即可

## 怎样去落地微前端？
微前端的灵感来源：
计算机 => 承载 操作系统 => 安装了多个应用如qq 微信 => 供用户消费使用
浏览器 => 承载 前端页面 => 安装不同的子应用 => 供用户消费使用

## Single-SPA
2018年诞生，single-spa是最早的微前端解决方案，它本身有两个缺点：
1. 没有处理父子应用、同级应用的样式隔离，会造成样式冲突
2. 所有应用都会使用window对象，会导致js执行冲突

但是它实现了两件事：
1. 路由劫持
2. 应用加载

就是通过不同的路由实现加载不同的应用

## qiankun
qiankun是基于single-spa实现的，提供了开箱即用的api，也就是single-spa + sandbox + import-html-entry
实现了子应用之间技术栈无关，并且接入简单，就和iframe一样


## 总结
一个微前端框架必须实现的功能：
1. 子应用独立构建独立部署
2. 子应用的技术栈不做限制
3. 子应用运行时动态加载
4. 主应用和子应用完全解耦
5. 子应用靠的是协议接入，也就是子应用必须导出bootstrap、mount和unmount方法给父应用进行调用然后加载子应用


## 为什么不是iframe?
如果iframe中的子应用中有一个导航，切换路由之后页面假设跳转到了列表页面，用户手动刷新页面就会出现状态丢失的问题。
因为刷新的一定是主应用，主应用一刷新所有应用重新加载，子应用又回到了原来的模样。

## 不同子应用的通信方式
1. 最简单的URL传递参数，子应用可以从location中获取数据，但是传递数据的能力很差
2. 基于浏览器提供的原生CustomEvent实现通信 但已经要废弃
3. 将属性和方法通过props进行通信
4. 使用全局变量比如window上挂一些属性
5. redux等
6. postMessage 实现跨源通信

## 公共依赖如何抽取
比如父应用使用了Vue,子应用也使用了Vue,不要重复加载相同的资源，这就需要公共资源进行抽取
1. CDN - externals
2. webpack5 模块联邦也可以实现


## 创建父 子应用
父应用可以是普通的html、可以是react、还可以是vue项目 不做限制
子应用这边限制为vue项目



## 流程
主引用加载，加载过程中调用registerApplication方法
开始加载子应用
当页面url的路由匹配到激活函数设置的规则的时候
就会去调用子应用中导出的三个函数mount bootstrap unmount
执行子应用mount函数
初始化Vue子应用，执行render函数生成虚拟DOM
将虚拟DOM转化为真实DOM
将真实DOM挂载到父应用中对应的el上
挂载的时候会基于当前页面的路由展示对应的子路由中的组件/vue/home => Home组件挂载到子应用中
保证子路由组件脚本加载的路径是绝对路径

## 问题
1. 加载子应用之后跑到中间，影响父应用中的样式

2. 切换子应用中的导航比如点击Home
那么路由中原来是/vue会变成/Home
解决方案就是给子应用的路由设置一个baseUrl为/vue 
子应用中的所有路由基于/vue进行加载


3. 加载Home路径的时候加载的还是子应用中的路径
比如还是localhost:8080/js/home.js
这是因为浏览器在请求资源路径为'/js/home.js'的时候会默认加上当前地址栏里面的域名
而又因为我们的父应用是运行在localhost:9999端口上的，所以最终拼接起来就是：
localhost:8080/js/home.js

而真正的home.js确存在于子应用的localhost:9999/js/home.js中，所以会出现错误
基于publicPath:限制发送请求的根路径

```js
if(window.singleSpaNavigate){
  // 在动态加载路由资源的时候，请加上这个固定的域名前缀
  __webpack_public_path__ = "http://localhost:9999/"
}
```

4. css样式被干扰，也就是没有css样式隔离
5. 加载子应用的资源时要自己构建script标签，那我怎么知道这个资源到底有多少呢？也就是不够灵活 不能动态加载js文件
6. 也没有js沙箱机制，切换不同的子应用，使用的都是一个共同的window

7. 子应用也想独立开发独立部署,上线的时候将子应用嵌入到父应用中
```js
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
```


## css样式隔离的问题
切换不同子应用的时候，会出现css冲突的问题

1. 子应用之前的样式隔离
Dynamic StyleSheet 动态样式表
加载A应用就把其他应用的样式移除 加载A的css
加载B的就把A的移除 添加B的样式

2. 主应用和子应用的样式如何隔离
加载不同子应用的时候，会覆盖或者污染主应用中的样式

### 1. BEM Block Element Modifier 
Block 模块
Element 模块中的组成部分
Modifier 表示组成部分的状态 不同的状态加载不同的样式

规则：block-name__element-name_mod-name
例如：index_nav_item_active

基于这种约定的方案可以解决样式冲突，但是比较复杂，有人不遵守约定怎么办

### 2. css modules
通过打包时生成不冲突的选择器名
在编译css文件的时候就给每一个样式选择器加上hash值，这样子选择器名就不会重复
比如vue中的样式在添加了scoped之后：
```css
.div{
    color:pink
}

/* 会被编译成为 */
.div[data-v-f3f3eg9]{
    color:pink
}
```
也就是为了保证各组件之间的css样式不冲突，那么给每一个组件都做唯一标记，也就是给每一个标签添加一个自定义属性data-v-f3f3eg9，这样子编译css代码的过程中就可以基于属性选择器[data-v-f3f3eg9]找到唯一的元素进行样式渲染，就算两个组件写的类名一样，编译之后交给浏览器加载时的css样式已经通过唯一hash值进行了样式隔离，所以不会冲突。


如果父组件中想要直接去修改子组件的样式，那么我们可以使用样式穿透：
```css
/* 父组件中的title样式 */
.wrapper .title{
    color:pink;
}

/* 子组件中也有一个title */
.title{
    color:red;
}
```

此时我们使用样式穿透，将父组件中的样式应用到子组件中的title上：
```css
.wrapper >>> .title{
    color:red;
}

.wrapper ::v-deep .title{
    color:red;
}

.wrapper /deep/ .title{
    color:red;
}
```


最终子组件中的样式会被编译为：
```css
.wrapper[data-v-f3f3eg9] .title{
    color:pink;
}
```

之前子组件中的样式为：
```css
.title[data-v-469af010]{
    color:red;
}
```

### 3. css-in-js
将css使用js的语法来写，样式多了不好进行统一管理
react中这样用

### 4. shadow Dom 真正意义上的隔离
Video标签上的快进等按钮是实际存在的，但是我们很难直接去获取到，但是它的DOM结构是真实存在的，否则浏览器如何解析呢

答案就在于shadow Dom，这些按钮都是以shadow Dom的方式存在于video标签中的，我们在shadow Dom中写样式，无论如何都不会影响到外部的样式

```html
<h1>这是外界的H1标签</h1>
<div id="shadow-app"></div>

<script>
    // 获取影子dom要挂载的真实dom元素对象
    const shadow = document.getElementById('shadow-app');

    // 基于attachShadow方法创建一个Shadow DOM 并设置模式为不可访问
    const shadowDom = shadow.attachShadow({mode:'closed'});

    // 向shadow dom上添加标签h1和样式
    let h1 = document.createElement('h1');
    h1.innerHTML = '这是shadowDom中的H1标签'

    let style = document.createElement('style');
    style.textContent = `
        h1{
            color:red;
        }
    `
    shadowDom.appendChild(h1);
    shadowDom.appendChild(style);

    // 如果一旦将h1标签插入到全局 那么样式就会被覆盖 
    // 所以shadow dom的缺点在于如果子应用没有向body全局挂一些元素的话 那么那么这可以说是真正意义上的样式隔离
    document.body.appendChild(h1);
</script>
```

shadow dom缺点就是：如果子应用没有向body全局挂一些元素的话 那么那么这可以说是真正意义上的样式隔离
比如react中的一些弹窗是直接挂载到window上的，此时也可能遇到样式冲突问题


## js沙箱sandbox 快照沙箱
js的沙箱的意思就是应用从开始运行到结束销毁，切换之后不会影响全局


假设主应用加载了a应用在window上挂了一个a属性，然后切换到b应用时其实b应用是可以访问修改window上的a属性的
所以就要实现一个js沙箱来保证一个完全隔离的环境
```js
class SnapshotSandbox {
    constructor(){
        this.proxy  = window;
        this.modifiedPropsMap = {};
        // 手动激活一次
        this.active();

    }

    active(){
        // 一进来保存window对象初始化快照
        this.windowSnapshot = {};
        for (const prop in window) {
            if (Object.hasOwnProperty.call(window, prop)) {
                this.windowSnapshot[prop] = window[prop];
            }
        }

        // 每次激活都去进行一次还原
        Object.keys(this.modifiedPropsMap).forEach(prop=>{
            window[prop] = this.modifiedPropsMap[prop];
        })
    }

    deactive(){
        // 退出之前进行差异diff 保证差异部分
        for (const prop in window) {
            if (Object.hasOwnProperty.call(window, prop)) {
                // 如果不相同 那么保存差异
                if(window[prop] !== this.windowSnapshot[prop]){
                    this.modifiedPropsMap[prop] = window[prop];
                    // 将window还原 保证切换过去是一个纯净的window
                    window[prop] = this.windowSnapshot[prop];
                }
            }
        }
    }
}

/* 快照沙箱只能用在单个子应用中 */
const sandbox = new SnapshotSandbox();
// 加载子应用a，此时被激活，进行快照 添加了一个对象obj
window.obja = {
    name:'lilei'
}
console.log(obja)
// 切换到b应用 此时a应用失活 对当前window进行diff 取出差异部分保存到快照沙箱实例上
sandbox.deactive();
console.log(obja)

// 又切回到a应用 此时被激活 将之前的差异取出来 放置到初始的window上
sandbox.active();
console.log(obja)
```

## js沙箱之代理沙箱ProxySandbox
可以实现多个应用之间的沙箱 把不同的应用使用不同的代理来进行处理

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

var proxy = new Proxy(target, handler);
new Proxy()表示生成一个Proxy实例
target参数表示所要拦截的目标对象
handler参数也是一个对象，用来定制拦截行为。

要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。
```js
/* 代理沙箱 */
class ProxySandbox {
    constructor(){
        let realWindow = window;
        let proxy = new Proxy({},{
            get(target,prop){
                return target[prop] || realWindow[prop];
            },
            set(target, prop, value) {
                target[prop] = value;
                return true
            },

        })
        this.proxy = proxy;
    }
}
const sandbox1 = new ProxySandbox();
const sandbox2 = new ProxySandbox();

window.abc = 100;

(function(window){
    // 函数形参window就是proxy对象实例 后续对proxy对象实例的读写就等于在操作目标对象 并且会被拦截
    window.abc = 200;
    console.log('sandbox1',window.abc) // sandbox1 200
})(sandbox1.proxy);

(function(window){
    window.abc = 300;
    console.log('sandbox2',window.abc) // sandbox2 300
})(sandbox2.proxy);

console.log('全局window',window.abc) // 全局window.abc 100

```


# 微前端框架 qiankun


 {
    name: 'vueApp',
    entry: '//localhost:10000', // 是基于fetch进行加载资源的 所以子应用需要解决跨域问题
    container: '#vue',
    activeRule: '/vue',
  },

主应用#app
    - #vue子应用容器
        - #__qiankun_microapp_wrapper_for_vue_app__框架生成元素
            - vue子应用自己内部的#app

    - #react子应用容器

## vue子应用

## react子应用接入
修改默认配置文件
.env注入环境变量
PORT=20000
WDS_SOCKET_PORT=20000 防止热更新出错

将子应用中html中的script注释掉
然后使用fetch进行请求 所以会有跨域问题
然后加载js 放进沙箱

父子通信