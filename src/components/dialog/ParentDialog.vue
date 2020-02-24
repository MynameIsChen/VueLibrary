<template>
  <div class="dialog" v-show="dialogType>0 || showAlertMsg==1">
    <LoadingDialog :dialogType="dialogType"></LoadingDialog>
    <WinDialog :dialogType="dialogType" :winInfo="winInfo" :winBgStyle="winBgStyle" :sureState="sureState"
      :cancelState="cancelState">
    </WinDialog>
    <TopicDetailDialog :dialogType="dialogType" :detailTitle="detailTitle" :closeDialog="closeDialog"
      :detailList="detailList"></TopicDetailDialog>
    <AwardDescDialog :dialogType="dialogType" :infoTab="infoTab" :campaignInfo="campaignInfo" :showCampany="showCampany"
      :awardList="awardList" :changeTab="changeTab" :closeDialog="closeDialog" :clickAwardItem="clickAwardItem"
      :getAwardClass="getAwardClass">
    </AwardDescDialog>
    <AlertDialog :showAlertMsg="showAlertMsg" :alertInfo="alertInfo" :inputBlur="inputBlur" :inputFocus="inputFocus"
      :closeAlert="closeAlert" :sureAlert="sureAlert">
    </AlertDialog>
    <RockDilog :dialogType="dialogType" :onClickRock="onClickRock"></RockDilog>
    <AwardVerifyCodeDialog :dialogType="dialogType" :codeData="codeData" :doQrOuter="doQrOuter" :doQrInner="doQrInner">
    </AwardVerifyCodeDialog>
    <SelfVerifyCodeDialog :dialogType="dialogType" :editCode="editCode" @clickQrOuter="clickQrOuter"
      :doQrInner="doQrInner" :inputBlur="inputBlur" :inputFocus="inputFocus" :sureEditVerify="sureEditVerify">
    </SelfVerifyCodeDialog>
  </div>
</template>

<script>
  // import QrCodeDialog from '../../components/dialog/QrCodeDialog'
  import LoadingDialog from '../../components/dialog/LoadingDialog'
  //"dialogType", "winInfo", "winBgStyle", "sureState", "cancelState"
  import WinDialog from '../../components/dialog/WinDialog'
  // "dialogType", "detailTitle", "closeDialog", "detailList"
  import TopicDetailDialog from '../../components/dialog/TopicDetailDialog'
  //"dialogType", "infoTab", "campaignInfo", "showCampany", "awardList", "changeTab", "closeDialog","clickAwardItem", "getAwardClass"
  import AwardDescDialog from '../../components/dialog/AwardDescDialog'
  //"showAlertMsg", "alertInfo", "inputBlur", "inputFocus", "closeAlert", "sureAlert"
  import AlertDialog from '../../components/dialog/AlertDialog'
  // "dialogType", "onClickRock"
  import RockDilog from '../../components/dialog/RockDilog'
  // "dialogType", "codeData", "doQrOuter", "doQrInner"
  import AwardVerifyCodeDialog from '../../components/dialog/AwardVerifyCodeDialog'
  // "dialogType","editCode", clickQrOuter, doQrInner, "inputBlur", "inputFocus", "sureEditVerify"
  import SelfVerifyCodeDialog from '../../components/dialog/SelfVerifyCodeDialog'

  export default {
    // props: ["dialogType", "showAlertMsg", "detailTitle", "closeDialog", "detailList"],
    props: {
      dialogType: Number,
      showAlertMsg: {
        type: Number,
        default: () => {
          return 0;
        }
      },
      detailTitle: {
        type: String,
        default: ""
      },
      closeDialog: {
        type: Function
      },
      detailList: {
        type: Array,
        default: function () {
          return [];
        },
        validator: (value) => {
          return value != undefined;
        }
      },
      infoTab: Number,
      campaignInfo: Array,
      showCampany: Boolean,
      awardList: Array,
      closeDialog: Function,
      clickAwardItem: Function,
      getAwardClass: Function,
      alertInfo: Object,
      inputBlur: Function,
      inputFocus: Function,
      closeAlert: Function,
      sureAlert: Function,
      onClickRock: Function,
      winInfo: Object,
      winBgStyle: Object,
      sureState: Function,
      cancelState: Function,
      codeData: String,
      editCode: String,
      doQrOuter: Function,
      clickQrOuter: Function,
      doQrInner: Function,
      sureEditVerify: Function,
      changeTab: Function
    },
    components: {
      // QrCodeDialog
      LoadingDialog,
      WinDialog,
      TopicDetailDialog,
      AwardDescDialog,
      AlertDialog,
      RockDilog,
      AwardVerifyCodeDialog,
      SelfVerifyCodeDialog
    },
    data() {
      return {}
    },
    methods: {},
  }
</script>
<style lang="scss">
  @import url("../../style/dialog.css");
</style>