<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>这是主应用基座的自己的路由Home</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
