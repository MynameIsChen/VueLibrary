<template>
  <div>
    <div class="float-scan" v-if="scanMode==1">当前活动仅供预览</div>
    <div class="float-music music-on circle" v-if="mainStyle.music" :style="mainStyle.music[musicType]"  @click.capture="onMusic"></div>
    <div class="float-feedback" @click.capture="onFeedback">投诉</div>
  </div>
</template>

<script>
  export default {
    props: ["scanMode", "onMusic", "onFeedback","mainStyle","musicType"]
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>
