<template>
  <div class="active-info" v-if="dialogType==2">
    <div class="active-head">
      <div class="head-buttons">
        <div :class="['head-desc',infoTab==0?'head-select':'']" @click.capture="changeTab(0)">活动说明</div> |
        <div :class="['head-award',infoTab==1?'head-select':'']" @click.capture="changeTab(1)">我的奖品</div>
      </div>
      <div class="head-close" @click.capture="closeDialog">
        <div class="close-icon"></div>
      </div>
    </div>

    <div class="desc-content" v-if="infoTab==0">
      <div :class="['desc-item', index==campaignInfo.length-1?'':'desc-item-diver']" v-if="descItem.type!=4 ||
        showCampany" v-show="descItem.type!=4 || showCampany" v-for="(descItem,index) in campaignInfo">
        <div class="desc-title">{{descItem.title}}</div>
        <div class="desc-value text-value">{{descItem.value}}</div>
        <a class="desc-link" v-if="descItem.url" v-show="descItem.url"
          :href="descItem.url.value">{{descItem.url.name}}</a>
        <div class="desc-img" v-if="descItem.logo" v-show="descItem.logo"
          :style="{backgroundImage:'url('+descItem.logo+')'}"></div>
      </div>
    </div>

    <div class="award-content" v-if="infoTab==1">
      <div class="award-list">
        <div class="award-item" v-for="award in awardList" @click.capture="clickAwardItem(award)">
          <div class="award-title">{{award.awardName}}</div>
          <div class="award-date">{{award.exchangeDate}}</div>
          <div :class="['award-state',getAwardClass(award)]"></div>
        </div>
      </div>
      <div class="nothing" v-if="!awardList||awardList.length<=0">暂无数据</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["dialogType", "infoTab", "campaignInfo", "showCampany", "awardList", "changeTab", "closeDialog",
      "clickAwardItem", "getAwardClass"
    ]
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>