<template>
  <div class="center-content" @click.self="onQrOuter" v-if="dialogType==6">
    <div class="qrcode-edit" @click.capture="doQrInner">
      <div class="edit-title">请联系核销员扫码核销：</div>
      <input class="edit-input" @blur="inputBlur" @focus="inputFocus" type="input" v-model="editCode" />
      <div class="edit-sure" @click.capture="sureEditVerify(editCode)">确认核销</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        editCode: null
      }
    },
    props: ["dialogType", "doQrInner", "inputBlur", "inputFocus", "sureEditVerify"],
    methods: {
      onQrOuter() {
        this.editCode = null;
        this.$emit("clickQrOuter");
      }
    },

  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>