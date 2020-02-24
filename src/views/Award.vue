<template>
  <div id="award-content" v-show="showPage==1">
    <div class="award-head">
      <div class="award-detail">
        <div class="award-name">{{awardName}}</div>
        <div class="award-desc">{{awardDesc}}</div>
        <div class="award-time">{{awardDate}}</div>
        <div :class="['award-state',stateClass]"></div>
      </div>
      <div v-if="awardIsExchange==0&&awardState!=0&&awardCode" class="award-copy">
        <div class="award-code">{{awardCode}}</div>
        <div class="btn-copy" data-clipboard-action="copy" :data-clipboard-text="codeData" @click.self="doCopy">复制券码
        </div>
      </div>
      <div v-if="awardIsExchange==0&&awardState!=0" class="copy-desc">{{optionTip}}</div>
      <div v-if="awardIsExchange!==0&&awardState!==1&&awardState!==2" class="tip-desc">{{awardStateTxt}}</div>
    </div>
    <div class="info-content" v-if="infos&&infos.length>0">
      <div class="info-head">兑奖券详情：</div>
      <div class="info-item" v-for="(item,index) in infos">
        <div class="info-title">{{item.title}}</div>
        <div class="info-desc text-value">{{item.desc}}</div>
      </div>
    </div>
    <div class="define-btn" v-if="defineName" @click.self="doDefineButton">{{defineName}}</div>
    <div class="button-exchange" v-if="exchangeBtnTxt" @click.capture="doExchange">{{exchangeBtnTxt}}</div>

    <ParentDialog :dialogType="dialogType" :inputBlur="inputBlur" :inputFocus="inputFocus" :doQrOuter="doQrOuter"
      :clickQrOuter="doQrOuter" :doQrInner="doQrInner" :sureEditVerify="sureEditVerify">
    </ParentDialog>
  </div>
</template>

<script>
  import app from '../js/app'
  import http from '../js/http'
  import util from '../js/util'
  import QRCode from "qrcodejs2"

  import ParentDialog from '../components/dialog/ParentDialog'

  let timer = null;

  export default {
    name: "award",
    computed: {},
    components: {
      ParentDialog
    },
    data() {
      return {
        showPage: 0,
        chargeType: 0, //兑奖方式
        awardName: null, //奖品信息
        awardDesc: null, //奖品的描述
        awardDate: null,
        optionTip: null, //操作提示文字：//公众号没有操作提示文字，线下兑奖及网页兑奖有提示文字；所有的都有自定义按钮
        awardIsExchange: 0,
        awardSource: 0,
        awardState: 0, //奖品状态，0未开始，1未核销，2未兑奖，3已核销，4已兑奖，5已过期
        awardStateTxt: null,
        awardCode: null,
        codeData: null, //兑奖码数据
        defineName: null, //自定义名称
        exchangeLink: null, //网页兑奖地址
        infos: [],
        logId: null,
        stateClass: "",
        exchangeBtnTxt: "",
        dialogType: 0, //0:无dialog,1:显示loading,2:显示活动说明/我的奖品,3:显示中奖状态,4话题详情，5奖品二维码，6奖品输入兑奖码，7摇一摇弹窗
        verifyType: 0, //核销方式：0输码/扫码核销，1自助核销
        verifyCodeData: null, //核销二维码数据
      }
    },
    created() {
      document.title = util.getSession("vote2women_campaign_title");
      this.logId = util.getQueryString("logId");
      http.readyShare(this);
    },
    mounted() {},
    methods: {
      //分享准备完成的下一步操作
      shareCompleteNext() {
        this.getAwardDetail();
        this.setDefineData();
      },
      setDefineData() {
        let followFlag = util.getSession("vote2women_follow_flag");
        let linkName = util.getSession("vote2women_follow_link_name");
        let buttonName = util.getSession("vote2women_follow_button_name");
        if (util.isValid(followFlag)) {
          //自定义按钮,0未自定义，1页面跳转，2一键关注
          if (followFlag == 0) { //隐藏
            this.defineName = "";
          } else if (followFlag == 1) { //页面跳转
            this.defineName = util.isValid(linkName) ? linkName : "";
          } else if (followFlag == 2) { //一键关注
            this.defineName = util.isValid(buttonName) ? buttonName : "";
          }
        }
      },

      //奖品详情
      getAwardDetail() {
        let that = this;
        http._getAwardDetail(that.logId).then(data => {
          if (!data.data.status) {
            this.$layer.msg(data.data.msg);
            return false;
          }
          if (data.data.code == 200 && data.data.data) {
            let config = data.data.data.awardConfig;
            let log = data.data.data.drawLog; //awardLog/drawLog
            that.infos = [];

            if (log) {
              util.setSession("vote2women_award_name", log.awardName);
              that.awardName = log.awardName; //奖品名称
              that.awardIsExchange = log.isExchange; //0未兑奖，1已兑奖,2已核销
            }

            if (config) {
              that.awardDesc = config.subheading; //奖品副标题
              that.exchangeLink = config.chargeUrl; //网页兑奖链接
              util.setSession("vote2women_charge_wxqrcode", config.chargeWxQrCode);
              //奖品兑换方式(1:表示公众号兑奖;2:表示线下门店兑奖;3:表示联系客服兑奖;4:表示平台兑奖;5:表示网页兑奖)
              that.chargeType = config.chargeType;
              that.awardSource = config.awardSource; //1自家奖品，2平台奖品
              that.verifyType = config.verifyType; //核销方式：1输码/扫码核销，2自助核销；扫码核销-暂不做
              //奖品兑奖有效时间
              if (config.chargeStartTime && config.chargeEndTime) {
                that.infos.push({
                  title: "有效日期：",
                  desc: util.timeChange(config.chargeStartTime, "-") + "至" + util.timeChange(config
                    .chargeEndTime, "-")
                });
              }
              if (that.chargeType !== 4) {
                that.infos.push({
                  title: "有效时段：",
                  desc: that.getDateTxt(config.availableTimeInterval, config.availableTime)
                });
              }
              if (config.chargeStoreAddr) {
                that.infos.push({
                  title: "兑奖地址：",
                  desc: config.chargeStoreAddr
                });
              }
              if (config.chargeDesc) {
                that.infos.push({
                  title: "兑奖须知：",
                  desc: config.chargeDesc
                });
              }
              if (config.chargeTele) {
                that.infos.push({
                  title: "客服电话：",
                  desc: config.chargeTele
                });
              }
            }

            if (config.chargeStartTime && config.chargeEndTime) {
              that.awardDate = "兑奖期限：" + util.timeChange(config.chargeStartTime, "-") + "至" + util.timeChange(config
                .chargeEndTime, "-");
            }
            // that.awardDate = "兑奖期限：" + that.getAwardTime(config, log); //10-29为奖品的有效时间
            that.awardState = app.getAwardState(config.chargeEndTime, that.awardSource, that.awardIsExchange, config
              .chargeStartTime);
            that.stateClass = app.getAwardBg(config.chargeEndTime, that.awardSource, that.awardIsExchange);
            that.awardStateTxt = app.getAwardTxt(config.chargeEndTime, that.awardSource, that.awardIsExchange,
              config.chargeStartTime);
            if (that.awardSource == 1 && log.couponCode) {
              that.codeData = log.couponCode;
              that.awardCode = "兑奖码：" + log.couponCode;
            }
            //奖品兑换方式(1:表示公众号兑奖;2:表示线下门店兑奖;3:表示联系客服兑奖;4:表示平台兑奖;5:表示网页兑奖)
            let serverData = config.chargeTip; //操作提示
            // config.registerSuccess; //公众号兑奖，登记成功时的返回语
            // config.couponCodeUsed; //公众号兑奖，提示券码已核销的提示语
            // config.couponCodeOverdue; //公众号兑奖时，券码已过期的提示语
            if (that.chargeType == 1) {
              that.exchangeBtnTxt = "前往公众号兑奖";
              that.optionTip = "凭券联系现场工作人员兑奖";
            } else if (that.chargeType == 2 || that.chargeType == 3) {
              if (that.verifyType == 2) {
                that.exchangeBtnTxt = "立即兑奖";
              }
              that.optionTip = serverData ? serverData : "凭券联系现场工作人员兑奖";
            } else if (that.chargeType == 4) {
              that.exchangeBtnTxt = "兑奖";
            } else if (that.chargeType == 5) {
              that.exchangeBtnTxt = "立即兑奖";
              that.optionTip = serverData ? serverData : "点击“立即兑奖”跳转到兑奖页面";
            }
            //已核销、已兑奖、已过期不显示按钮
            if (that.awardState > 2) {
              that.exchangeBtnTxt = "";
            }

            that.$nextTick(() => {
              this.showPage = 1;
              this.dialogType = 0;
            });
          }
        })
      },

      getAwardTime(config, log) {
        //兑奖期限类型(1表示固定日期 2表示固定时长)
        if (config.chargeTermType == 1) {
          return timeChange(config.chargeStartTime, '-') + "至" + timeChange(config.chargeEndTime, '-');
        } else if (config.chargeTermType == 2) {
          if (log.attendTime && config.effectiveAfterReceive != undefined && config.chargeFixedDuration != undefined) {
            let at = util.changeDate(log.attendTime).getTime();
            let st = at + config.effectiveAfterReceive * 24 * 3600 * 1000;
            let et = st + config.chargeFixedDuration * 24 * 3600 * 1000;
            return util.formatDate(st) + "至" + util.formatDate(et);
          }
        }
      },

      //兑换
      doExchange() {
        if (this.awardState == 1 || this.awardState == 2) {
          //奖品兑换方式(1:表示公众号兑奖;2:表示线下门店兑奖;3:表示联系客服兑奖;4:表示平台兑奖;5:表示网页兑奖)
          if (this.chargeType == 1) {
            //全局需要一个公众号的二维码
            app.locationFollow(1);
          } else if (this.chargeType == 2 || this.chargeType == 3) {
            this.offlineVerify(); ///线下/门店兑奖
          } else if (this.chargeType == 4) {
            this.platformVerify(); //平台兑奖
          } else if (this.chargeType == 5) {
            this.webVerify();
          }
        } else {
          this.$layer.msg(this.awardStateTxt);
        }
      },

      //线下兑奖
      offlineVerify() {
        //扫码核销：没有扫码结果页面=商户端做输入码核销；自主核销：用户自己输入码核销
        //核销方式：1输码/扫码核销，2自助核销
        if (this.verifyType == 1) {
          this.dialogType = 5;
          this.$nextTick(() => {
            this.drawQRCode();
          })
        } else if (this.verifyType == 2) {
          this.dialogType = 6;
        }
      },

      //平台兑奖
      platformVerify() {
        app.toPage(this, 'exchange', this.logId);
      },
      //网页兑奖
      webVerify() {
        //通知服务器网页兑奖开始，然后跳转页面
        if (this.codeData) {
          http._webPageVerify(this.codeData).then(data => {
            if (!data.data.status) {
              this.$layer.msg(data.data.msg);
              return;
            }
            if (data.data.code == 200) {
              this.getAwardDetail();
              window.location.href = this.exchangeLink;
              return;
            }
          })
        }
      },

      //确认输入核销
      sureEditVerify(editCode) {
        if (editCode) {
          http._codeVerify(editCode).then(data => {
            if (!data.data.status) {
              this.$layer.msg(data.data.msg);
              return;
            }
            if (data.data.code == 200) {
              this.$layer.msg("核销成功");
              this.doQrOuter();
              this.getAwardDetail();
            }
          })
        } else {
          this.$layer.msg("请输入核销码");
        }
      },

      // 复制
      doCopy() {
        util.copyToClipboard(this.$clipboard, this.$layer, ".btn-copy");
      },

      // 自定义按钮点击
      doDefineButton() {
        let followFlag = util.getSession("vote2women_follow_flag");
        let linkUrl = util.getSession("vote2women_follow_link_url");
        if (followFlag == 1 && util.isValid(linkUrl)) { //页面跳转
          window.location.href = linkUrl;
        } else if (followFlag) { //一键关注
          app.locationFollow();
          return;
        }
      },

      //点击dialog外部区域关闭
      doQrOuter() {
        this.dialogType = 0;
      },

      //点图内
      doQrInner() {},

      //绘制二维码
      drawQRCode() {
        let qrcode = $('.qrcode-canvas')[0];
        let codeimg = $('.qrcode-img')[0];
        new QRCode(qrcode, {
          text: this.verifyCodeData,
          width: qrcode.clientHeight,
          height: qrcode.clientHeight,
          render: "canvas", //渲染方式指定canvas方式
          typeNumber: -1, //计算模式
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L
        });

        let canvas = document.getElementsByTagName('canvas')[0];
        // canvas.toDataURL 返回的是一串Base64编码的URL
        // 绘制区隐藏，为显示区配置数据;解决小米直接绘制的不能扫码的问题
        let image = new Image();
        image.src = canvas.toDataURL("image/png");
        qrcode.style.display = "none";
        // 添加DOM
        codeimg.append(image);
      },

      inputBlur(e) {
        if (timer) {
          clearTimeout(timer);
        }
      },

      inputFocus(e) {
        timer = setTimeout(() => {
          document.body.scrollTop = 0;
          window.pageYOffset = 0;
          document.documentElement.scrollTop = 0;
        }, 100);
      },

      getDateTxt(availableTimeInterval, times) {
        let arrTime = JSON.parse(times);
        //可用时段（0表示全部 1表示部分）
        if (availableTimeInterval == 0) {
          return "周一至周日";
        }
        //数组大于2则有至
        if (arrTime) {
          if (arrTime.length < 2) {
            return arrTime[0];
          }
        } else {
          return "";
        }
        let days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        let arr = [];
        //根据顺序对位：排序
        for (let i = 0; i < days.length; i++) {
          arr[i] = "";
          for (let j = 0; j < arrTime.length; j++) {
            let a = days[i];
            let b = arrTime[j];
            if (a == b) {
              arr[i] = days[i];
              continue;
            }
          }
        }

        // 查询是否存在空位
        let n = [];
        let index = 0;
        let spaceCount = 0;
        let sTxt = "";
        let eTxt = "";
        for (let k = 0; k < arr.length; k++) {
          if (arr[k]) {
            n[index] = arr[k];
            //不空
            index++;
            if (!sTxt) {
              //没有开始，开始位置
              sTxt = arr[k];
            } else if (index == arrTime.length) {
              //结束位置
              eTxt = arr[k];
            }
          } else if (sTxt && !arr[k] && index < arrTime.length) {
            //已开始，为空，结束前
            spaceCount++;
          }
        }

        if (spaceCount == 0) {
          // 连续
          return sTxt + "至" + eTxt;
        } else {
          return n.toString();
        }
      }
    }
  }
</script>

<style lang="scss">
  @import url("../style/reset.css");
  @import url("../style/dialog.css");
  @import url("../style/award.css");

  #award-content {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }
</style>
