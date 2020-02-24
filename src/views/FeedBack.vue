<template>
  <div id="feedback" v-show="showPage==1">
    <div class="feed-head">请选择投诉该网页的原因：</div>
    <div class="feed-list">
      <div class="feed-item" v-for="item in feedData" @click.capture="onItem(item)">
        <div class="feed-title">{{item}}</div>
        <div class="feed-next"></div>
      </div>
    </div>

    <ParentDialog :showAlertMsg="showAlertMsg" :alertInfo="alertInfo" :inputFocus="inputFocus" :inputBlur="inputBlur"
      :closeAlert="closeAlert" :sureAlert="sureAlert" :clickQrOuter="clickQrOuter">
    </ParentDialog>
  </div>
</template>

<script>
  import app from '../js/app'
  import http from '../js/http'
  import util from '../js/util'

  import ParentDialog from '../components/dialog/ParentDialog'

  export default {
    computed: {

    },
    components: {
      ParentDialog
    },
    data() {
      return {
        showPage: 0, //
        feedData: [], //反馈信息
        alertInfo: {}, //弹窗信息;0:通用样式;1:秘钥进入;2:截图审核;3:提交审核(2:暂时去掉-截图功能无法实现)
        showAlertMsg: 0, //是否显示弹窗信息,0:不显示;1:显示
        secretKey: null, //秘钥信息
      }
    },
    created() {
      document.title = util.getSession("vote2women_campaign_title");
      http.readyShare(this);
    },
    mounted() {},
    methods: {
      clickQrOuter() {},
      //分享准备完成的下一步操作
      shareCompleteNext() {
        this.setData();
        this.showPage = 1;
      },
      //绘制二维码
      setData() {
        this.feedData = ["网页包含欺诈信息（如：假红包）",
          "网页包含色情信息",
          "网页包含暴力恐怖信息", "网页包含政治敏感信息", "网页在收集个人隐私信息（如：钓鱼链接）",
          "网页包含诱导分享/关注性质的内容",
          "网页可能包含谣言信息",
          "网页包含赌博信息"
        ];
      },

      //提交反馈
      onItem(item) {
        http._createComplaint({
          content: item
        }).then(data => {
          if (!data.data.status) {
            this.$layer.msg(data.data.msg);
            return;
          }
          if (data.data.code == 200) {
            this.showAlertInfo();
          }
        });
      },
      showAlertInfo() {
        this.showAlertMsg = 1;
        this.alertInfo.alertType = 3;
        this.alertInfo.alertTitle = "您已提交成功，请耐心等待审核";
        this.alertInfo.alertRightTxt = "关闭";
      },
      closeAlert() {
        this.showAlertMsg = 0;
      },
      sureAlert() {
        this.showAlertMsg = 0;
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
    },
  }
</script>

<style lang="scss">
  @import url("../style/reset.css");
  @import url("../style/feedback.css");
  @import url("../style/dialog.css");

  #feedback {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }
</style>
