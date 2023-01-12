<template>
  <div id="app">
    <el-menu :router="true" mode="horizontal">
      <!-- 可以加载主基座自己的路由 -->
      <el-menu-item index="/">主应用Home</el-menu-item>

      <!-- 也可以引用其他子路由 -->
      <el-menu-item index="/vue">vue子应用</el-menu-item>
      <el-menu-item index="/react">react子应用</el-menu-item>
    </el-menu>

    <!-- 展示默认组件的 -->
    <router-view></router-view>

    <!-- 挂载vue子应用的功能 -->
    <div id="vue"></div>

    <!-- 挂载react子应用的功能 -->
    <div id="react"></div>

  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
