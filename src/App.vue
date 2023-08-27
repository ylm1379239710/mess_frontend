<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import HomePage from './components/HomePage.vue'
export default {
  name: 'App',
  components: {
    HomePage
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
 #app{
  height: 100vh;
  width: 100vw;
 }
*{
  margin: 0;
  padding: 0;
}
</style>
