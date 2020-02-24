<template>
  <div class="center-content" @click.self="doQrOuter" v-if="dialogType==5">
    <div class="qrcode-content" @click.capture="doQrInner">
      <div>请联系核销员扫码核销</div>
      <div class="qrcode-parent">
        <div class="qrcode-canvas"></div>
        <div class="qrcode-img"></div>
      </div>
      <div class="qrcode-txt">{{codeData}}</div>
      <div class="qrcode-desc">凭券联系现场工作人员兑奖</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["dialogType", "codeData", "doQrOuter", "doQrInner"]
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>