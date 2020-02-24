<template>
  <div id="follow-content" v-show="pageShow == 1">
    <div class="follow-info">
      <div class="follow-code">
        <div class="code-no" v-if="!qrImg" v-show="!qrImg">
          <div class="code-add">+</div>
          <div class="code-tip">请上传二维码</div>
        </div>
        <img class="qrcode" crossorigin="anonymous" v-if="qrImg" v-show="qrImg" :src="qrImg"></img>
      </div>
      <img class="follow-finger" :src="fingerImg"></img>
      <img class="follow-img" v-if="canvasData" :src="canvasData" />
    </div>
    <div class="follow-layer" v-if="imgLoading"></div>
    <div class="follow-tip" v-if="!imgLoading">长按指纹，识别二维码</div>
  </div>
</template>

<script>
  import http from '../js/http'
  import util from '../js/util'
  import html2canvas from 'html2canvas'

  export default {
    name: "follow",
    computed: {},
    data() {
      return {
        pageShow: 0,
        fingerImg: null,
        qrImg: null,
        canvasData: null,
        imgLoading: true,
      }
    },
    created() {
      document.title = util.getSession("vote2women_campaign_title");
      http.readyShare(this);
      this.fingerImg = require("assets/fingerprint.png");
    },
    mounted() {},
    methods: {
      shareCompleteNext() {
        this.setQrData();
      },

      setQrData() {
        let type = util.getQueryString("type");
        let img = null;
        if (!type) {
          img = util.getSession("vote2women_follow_img");
        } else if (type == 1) {
          img = util.getSession("vote2women_charge_wxqrcode");
        }
        if (util.isValid(img)) {
          this.qrImg = img;
          this.pageShow = 1;
          this.$nextTick(() => {
            setTimeout(() => {
              this.toCanvas();
            }, 300);
          })
        } else {
          this.$layer.msg("无公众号信息");
          this.$router.go(-1);
        }
      },

      // 绘制图片
      toCanvas() {
        let node = $(".follow-info")[0]; //绘制节点
        util.doCanvasToBlob(html2canvas, node).then((canvas) => {
          this.imgLoading = false;
          this.canvasData = canvas.toDataURL("image/jpeg");
        }).catch(error => {
          console.log(error);
        })
      },
    }
  }
</script>

<style lang="scss">
  @import url("../style/reset.css");
  @import url("../style/follow.css");

  #follow-content {
    width: 100%;
    height: 100%;
    overflow: scroll;
    background-color: #f2f2f2;
  }
</style>
