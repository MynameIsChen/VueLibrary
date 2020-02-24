<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "app",
    computed: {},
    created() {},
    mounted() {},
    methods: {},
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333;
    width: 100%;
    height: 100%;
  }

  div {
    text-align: left;
  }
</style>