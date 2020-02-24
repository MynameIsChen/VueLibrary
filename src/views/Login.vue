<template>
  <div id="login">
    <router-view />
  </div>
</template>

<script>
  import app from '../js/app'
  import http from '../js/http'
  import util from '../js/util'

  export default {
    name: "login",
    computed: {},
    data() {
      return {}
    },
    created() {
      //必须先登录(登录只有进入时会操作)，不然会把登录前的操作重新走一次
      util.checkUserAgent().then(() => {
        app.checkLogin().then(() => {
          http._getCampaignInfo(this);
        });
      })
    },
    mounted() {},
    methods: {
      shareCompleteNext() {
        this.toHome();
      },
      toHome() {
        app.toPage(this, 'home');
      }
    },
  }
</script>