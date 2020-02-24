<template>
  <div id="not-found">
    找不到该页面
    <div class="not-url">{{url}}</div>
    <div class="redirect-url" @click.capture="toHome" v-if="redirectUrl">返回首页</div>
  </div>
</template>

<script>
  import app from '../js/app'
  import util from '../js/util'

  export default {
    created() {
      this.url = window.location.href;
      this.redirectUrl = app.getIndex();
    },
    data() {
      return {
        url: "",
        redirectUrl: ""
      }
    },
    methods: {
      toHome() {
        if (this.redirectUrl) {
          window.location.href = this.redirectUrl;
        }
      }
    },
  }
</script>

<style lang="scss">
  #not-found {
    width: 100%;
    font-size: 0.32rem;
    text-align: center;
    padding: 1rem 0.2rem;
    box-sizing: border-box;
  }

  .not-url {
    font-size: 0.24rem;
    margin-top: .2rem;
    text-align: center;
  }

  .redirect-url {
    width: 2rem;
    margin: auto;
    margin-top: 1rem;
    text-align: center;
    color: white;
    font-size: 0.28rem;
    background-color: gray;
    padding: 0.2rem;
    box-sizing: border-box;
    border-radius: 0.1rem;
  }
</style>