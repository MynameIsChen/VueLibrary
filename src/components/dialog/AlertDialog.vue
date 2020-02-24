<template>
  <div class="alert-msg" v-if="showAlertMsg==1">
    <div class="alert-content">
      <div class="alert-title" :style="{display:alertInfo.alertType==1?'none':''}">{{alertInfo.alertTitle}}</div>
      <div class="alert-key" :style="{display:alertInfo.alertType !==1?'none':''}">
        <div class="key-title">输入访问秘钥进入活动：</div>
        <input class="key-input" @blur="inputBlur" @focus="inputFocus" autocomplete="off" type="text"
          placeholder="请输入秘钥" v-model="secretKey">
      </div>
      <div class="alert-buttons">
        <div class="alert-cancel" @click.self="closeAlert" :style="{display:alertInfo.alertType!==2?'none':''}">
          {{alertInfo.alertLeftTxt}}</div>
        <div class="alert-sure" @click.self="sureAlert(secretKey)">{{alertInfo.alertRightTxt}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["showAlertMsg", "alertInfo", "inputBlur", "inputFocus", "closeAlert", "sureAlert"],
    data() {
      return {
        secretKey: null
      }
    },
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>