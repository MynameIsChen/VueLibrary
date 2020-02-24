<template>
  <div id="exchange" v-show="showPage == 1">
    <div class="head-bg"></div>
    <div class="exchange-content">
      <div class="item-txt item-title">正在兑换：{{awardName}}</div>
      <div class="phone-tip">手机号</div>
      <input class="item-phone" @blur="inputBlur" @focus="inputFocus" type="number" v-model="phone"
        placeholder="请输入手机号"></input>
    </div>
    <div class="item-button button-submit" @click.capture="doSubmit">提交后领奖</div>
    <div class="item-button button-back" @click.capture="doBack">返回</div>
  </div>
</template>
<script>
  import http from '../js/http'
  import util from '../js/util'
  let timer = null;

  export default {
    computed: {},
    data() {
      return {
        showPage: 0,
        phone: null,
        logId: null,
        awardName: null,
      }
    },
    created() {
      document.title = util.getSession("vote2women_campaign_title");
      this.logId = util.getQueryString("logId");
      this.awardName = util.getSession("vote2women_award_name");
      http.readyShare(this);
    },
    mounted() {},
    methods: {
      shareCompleteNext() {
        this.$nextTick(() => {
          this.showPage = 1;
        })
      },
      doBack() {
        this.$router.back(-1);
      },

      doSubmit() {
        var regS = /^1[3456789]\d{9}$/; // 手机号
        if (!regS.test(this.phone)) {
          this.$layer.msg("请输入正确的手机号码");
          return false;
        }
        http._exchangeAward(this.logId, this.phone).then(data => {
          if (data.data.msg) {
            this.$layer.msg(data.data.msg);
          }
        })
      },

      //解决输入框输入完成后留白
      inputBlur(e) {
        if (timer) {
          clearTimeout(timer);
        }
      },
      inputFocus(e) {
        timer = setTimeout(() => {
          document.body.scrollTop = 0;
          window.pageYOffset = 0;
          document.documentElement.scrollTop = 0;
        }, 100);
      },
    }
  }
</script>

<style>
  @import url("../style/reset.css");
  @import url("../style/exchange.css");
</style>
