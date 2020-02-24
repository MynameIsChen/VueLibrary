<template>
  <div class="loading" v-if="dialogType==1">
    <div class="loading-icon circle"></div>
  </div>
</template>

<script>
  export default {
    props: ["dialogType"]
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>