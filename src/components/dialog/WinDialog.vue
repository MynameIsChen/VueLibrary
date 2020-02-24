<template>
  <div class="win-state" v-if="dialogType==3">
    <div class="state-title">{{winInfo.title}}</div>
    <div class="state-img" :style="winBgStyle"></div>
    <div class="state-desc">{{winInfo.desc}}</div>
    <div class="state-button state-sure" @click.capture="sureState">{{winInfo.sureDesc}}</div>
    <div class="state-button state-cancel" @click.capture="cancelState" v-if="checkValue(winInfo.cancelDesc)">
      {{winInfo.cancelDesc}}
    </div>
  </div>
</template>

<script>
  import util from '../../js/util'

  export default {
    props: ["dialogType", "winInfo", "winBgStyle", "sureState", "cancelState"],
    methods: {
      checkValue(value) {
        return util.isValid(value);
      },
    },
  }
</script>