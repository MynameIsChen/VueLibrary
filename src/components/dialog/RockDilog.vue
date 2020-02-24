<template>
  <div class="rock-content" v-if="dialogType==7">
    <div class="rock-img" @click.self="onClickRock"></div>
    <div class="rock-txt">左右摇一摇，幸运抽大奖</div>
  </div>
</template>

<script>
  export default {
    props: ["dialogType", "onClickRock"]
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>