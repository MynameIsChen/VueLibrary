<template>
  <div class="qrcode" @click.capture="onCodeContent">
    <img id="code-img" :src="qrcode" @click.self="onCodeImg" />
  </div>
</template>
<script>
  export default {
    props: ["qrcode", "onCodeContent", "onCodeImg"]
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>