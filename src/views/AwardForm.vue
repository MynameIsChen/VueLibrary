<template>
  <div id="form-content" v-show="showPage == 1">
    <div class="form-head">为了方便兑奖，请填写您的联系信息：</div>
    <div class="form-list">
      <div class="form-item" v-for="(item,index) in formList" v-if="item.useState" :style="getFormItemStyle(item)">
        <!-- form表单==item -->
        <!-- 标题 -->
        <div v-if="item.useState" class="form-title item-center">{{item.title}}</div>
        <!-- 单行文本输入 -->
        <input @blur="inputBlur" @focus="inputFocus" v-if="item.viewType=='input'" class="item-input"
          v-on:input="onFormInput($event)" type="input" :placeholder="item.title" v-model="modelList[index]" />
        <!-- 数字输入 -->
        <input @blur="inputBlur" @focus="inputFocus" v-if="item.viewType=='number'" min="0" class="item-input"
          v-on:input="onFormInput($event,index)" type="input" :placeholder="item.title" v-model="modelList[index]" />
        <!-- 单选-->
        <div style="display:flex;flex-wrap:wrap;" v-if="item.viewType=='radio'">
          <label class="item-center item-label" v-for="(itemradio,i) in item.refValues"
            v-on:change="changeLabel($event,index)">
            <input @blur="inputBlur" @focus="inputFocus" name="radio" type="radio" :value="itemradio.name"
              v-model="modelList[index]" />{{itemradio.name}}</label>
        </div>
        <!-- 多选 -->
        <div style="display:flex;flex-wrap:wrap;" v-if="item.viewType=='select'">
          <label class="item-center item-label" v-for="(itemradio,i) in item.refValues"
            v-on:change="changeLabel($event,index)">
            <input @blur="inputBlur" @focus="inputFocus" name="checkbox" type="checkbox" :value="itemradio.name"
              v-model="modelList[index][i]" />
            <div class="label-txt">{{itemradio.name}}</div>
          </label>
        </div>
        <!-- 日期选择器 -->
        <label class="item-end" v-if="item.viewType=='date'" v-on:change="changeLabel($event,index)">
          <input @blur="inputBlur" @focus="inputFocus" name="date" type="date" v-model="modelList[index]" />
        </label>
        <!-- 时间选择器 -->
        <label class="item-end" v-if="item.viewType=='time'" v-on:change="changeLabel($event,index)">
          <input @blur="inputBlur" @focus="inputFocus" name="time" type="time" v-model="modelList[index]" />
        </label>
        <!-- 图片选择器 -->
        <div class="item-end" v-if="item.viewType=='img'" v-on:change="changeLabel($event,index)">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <!-- 多行文本 -->
        <textarea @blur="inputBlur" @focus="inputFocus" v-if="item.viewType=='text_area'"
          class="item-input item-textarea" v-on:input="onFormInput($event)" :placeholder="item.title"
          v-model="modelList[index]"></textarea>
      </div>
    </div>
    <div class="form-tip">注：若因未填写资料或资料填写错误无法兑奖，主办方不承担相关法律责任</div>
    <div class="form-submit" @click.capature="submitForm">提交</div>
  </div>
</template>

<script>
  import app from '../js/app'
  import http from '../js/http'
  import util from '../js/util'
  let timer = null;

  export default {
    name: 'awardform',
    computed: {},
    data() {
      return {
        showPage: 0,
        formList: [], //
        modelList: [], //输入信息model-1
        postData: [],
        imgIndex: -1, //图片在数据区位置
        uploadUrl: '', //文件上传路径
        imageUrl: '', //图片预览路径
        logId: null,
      }
    },
    created() {
      document.title = util.getSession("vote2women_campaign_title");
      this.logId = util.getQueryString("logId");
      this.uploadUrl = app.getMiApiPath() + "mi/template/uploadImage";
      this.checkForm();
      http.readyShare(this);
    },
    mounted() {},
    methods: {
      checkForm() {
        let formList = util.getSession("vote2women_form_list");
        if (formList) {
          let list = formList;
          $.map(list, (x, index) => {
            if (x) {
              if (x.viewType == "select") {
                this.modelList[index] = [];
              }
              if (x.refValues) {
                x.refValues = eval('(' + x.refValues + ')');
              }
            }
          })
          this.formList = list;
        }
      },

      //分享准备完成的下一步操作
      shareCompleteNext() {
        this.showPage = 1;
      },
      //配置item的样式
      getFormItemStyle(formItem) {
        return {
          flexDirection: formItem.viewType == 'select' || formItem.viewType == 'radio' ? 'column' : 'row',
        };
      },

      //提交表单
      submitForm() {
        let listData = [];
        let regS = /^1[3456789]\d{9}$/; // 手机号码
        var regEmail = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
        var idcardReg =
          /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
        let regChar = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
        let regAddress = /^[a-zA-Z0-9\u4E00-\u9FA5]{0,}$/; //地址校验

        //validateType:String:text_area/input;telephone:number;viewType：radio,select,date,time,img,number
        let index = 0;
        for (let i = 0; i < this.formList.length; i++) {
          let item = this.formList[i];
          let itemData = this.modelList[i]; //
          // console.log("submitForm:", item, itemData);
          //值是否有效,及是否使用
          if (item && item.useState) {
            //多选取值
            if (item.viewType == 'select') {
              let info = "";
              let index = 0;
              itemData.map((value, key) => {
                // console.log('select:', item, key, value);
                if (value) {
                  info = info + (index == 0 ? "" : ",") + item.refValues[key].name;
                  index = index + 1;
                }
              })
              itemData = info;
            }
            //值有效且类型为string：把字符串中所有的空格去掉
            if (itemData && typeof itemData === String) {
              itemData = itemData.replace(/\s+/g, "");
            }
            // 是否为空
            if (!itemData || itemData.length == 0) {
              //为空且需要检测则提示
              if (item.needState) {
                this.$layer.msg(item.title + "不能为空");
                return;
              }
            } else {
              //不空则全部校验
              if (item.validateType == "telephone") {
                if (!regS.test(itemData)) {
                  this.$layer.msg("请输入正确的手机号码");
                  return;
                }
              }
              if (item.viewType == 'input' && item.validateType !== 'email' && item.validateType !== 'identityCard') {
                //单行文本10个字符
                let inputMaxNum = 10;
                if (util.getLength2(itemData) > inputMaxNum * 2) {
                  this.$layer.msg(item.title + "不能输入超过" + inputMaxNum + "个长度 ");
                  return;
                }
              }
              if (item.viewType == 'text_area') {
                //多行文本50个字符
                let areaMaxNum = 50;
                if (util.getLength2(itemData) > areaMaxNum * 2) {
                  this.$layer.msg(item.title + "不能输入超过" + areaMaxNum + "个长度 ");
                  return;
                }
              }
              if (item.validateType == 'email') {
                if (!regEmail.test(itemData)) {
                  this.$layer.msg("请输入正确的邮箱地址");
                  return;
                }
              }
              if (item.validateType == 'identityCard') {
                if (!idcardReg.test(itemData)) {
                  this.$layer.msg("请输入正确的身份证号码");
                  return;
                }
              }
              if (item.title == "地址") {
                if (!regAddress.test(itemData)) {
                  this.$layer.msg("请输入正确的" + item.title);
                  return;
                } else {
                  this.modelList[i] = itemData;
                }
              }
            }

            listData[index] = {
              campaignId: util.getQueryString("campaignId"),
              formItemCode: item.formItemCode,
              id: item.id,
              length: item.length ? item.length : 0,
              needState: item.needState,
              refValues: item.refValues,
              title: item.title,
              useState: item.useState,
              validateType: item.validateType,
              viewType: item.viewType,
              value: itemData ? itemData : null,
            };
            index = index + 1;
          }
        }

        if (listData && listData.length > 0) {
          this.postData = listData;
          this.postForm();
        } else {
          this.$layer.msg("提交信息为空");
        }
      },

      //确定--填写表单
      postForm() {
        http._addExchangeForm(this.logId, this.postData).then(data => {
          if (!data.data.status) {
            this.$layer.msg(data.data.msg);
            return;
          }
          if (data.data.code == 200) {
            this.$layer.msg("提交成功");
            this.toDetail();
            return;
          }
        });
      },

      toDetail() {
        app.toPage(this, 'award', this.logId, true);
      },

      //输入信息监听
      onFormInput(event, index) {
        // console.log("onFormInput:", event, this.modelList);
        if (index) {
          let data = this.modelList[index];
          if (data) {
            let result = data.replace(/\D/g, '');
            this.modelList[index] = result;
          }
        }
      },
      changeLabel(event, index) {
        // console.log("changeLabel:", event, this.modelList, index, this.imgFile);
        //图片设置
        if (this.formList[index].viewType == 'img') {
          this.imgIndex = index;
        }
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
      handleAvatarSuccess(res, file) {
        // console.log("handleAvatarSuccess:", res, file);
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res.status && res.code == 200) {
          this.modelList[this.imgIndex] = res.data;
        } else {
          this.$layer.msg("图片上传失败,请重新上传");
        }
      },
      beforeAvatarUpload(file) {
        this.$layer.msg("图片上传中");
        // console.log("beforeAvatarUpload:", file);
        let maxMbSize = 2;
        const isJPG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isGif = file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < maxMbSize;
        if (!isJPG && !isPng && !isGif) {
          this.$layer.msg('上传头像图片只能是JPG / PNG / GIF 格式!');
        }
        if (!isLt2M) {
          this.$layer.msg("上传头像图片大小不能超过 " + maxMbSize + " MB!");
        }
        return isLt2M && (isJPG || isPng || isGif);
      }
    }
  }
</script>

<style lang="scss">
  @import url("../style/reset.css");
  @import url("../style/form.css");

  #form-content {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }
</style>
