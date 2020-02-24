<template>
  <div class="obj-content" v-if="dialogType==4">
    <div class="obj-detail">
      <div class="detail-head">
        <div class="detail-title">{{detailTitle}}</div>
        <div class="detail-close" @click.capture="closeDialog">
          <img src="../../assets/close-gray.png" alt=" ">
        </div>
      </div>
      <div class="detail-list">
        <div class="detail-item" v-for="(item,index) in detailList">
          <img class="detail-img" :src="item.image" alt=" " />
          <div class="detail-desc text-value">{{item.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // props: ["dialogType", "detailTitle", "closeDialog", "detailList"],
    props: {
      dialogType: Number,
      detailTitle: {
        type: String,
        default: ""
      },
      closeDialog: {
        type: Function
      },
      detailList: {
        type: Array,
        default: [],
        validator: (value) => {
          return value != undefined;
        }
      }
    },
  }
</script>

<style lang="scss">
  @import url("../../style/dialog.css");
</style>