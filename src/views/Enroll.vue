<template>
    <div class="enroll-content" :style="themeColor" v-if="showPage==1">
        <div class="enroll-main">
            <div class="enroll-tag">填写参赛者信息</div>
            <div><input class="enroll-input" @blur="inputBlur" @focus="inputFocus"
                        v-on:input="onFormInput($event)"
                        type="text "
                        v-model="player.nick" placeholder="请输入参赛者名称"></div>
            <div><textarea class="enroll-area" @blur="inputBlur" @focus="inputFocus"
                           v-on:input="onFormInput($event)"
                           v-model="player.desc" placeholder="请输入参赛者简介"></textarea></div>
            <div class="cover-content">
                <div class="enroll-cover">
                    <el-upload class="avatar-uploader cover-img"
                               :style="{opacity: coverUrl?1:0.6}"
                               show-file-list="false"
                               :action="uploadUrl"
                               :show-file-list="false"
                               :on-success="handleCoverSuccess"
                               :on-error="handleCoverError"
                               :before-upload="beforeCoverUpload">
                        <img v-if="coverUrl" :src="coverUrl" class="cover-img">
                        <i v-else class="el-icon-plus avatar-uploader-icon cover-i"></i>
                    </el-upload>
                    <div class="cover-add" v-if="!coverUrl"></div>
                    <div class="cover-del" @click="delCover"></div>
                </div>
                <div class="enroll-desc">
                    <div>请上传1张封面图，用于首页及详情页展示拉票</div>
                    <div class="desc-small">建议尺寸750PX*500PX</div>
                </div>
            </div>
            <div class="info-list">
                <div class="enroll-info" v-for="index in upImgNum" @click="clickInfo(index-1)">
                    <el-upload class="avatar-uploader info-img"
                               :style="{opacity: infoList&&infoList[index-1]&&infoList[index-1].url?1:0.6}"
                               show-file-list="false"
                               :action="uploadUrl"
                               :show-file-list="false"
                               :on-success="handleInfoSuccess"
                               :on-error="handleInfoError"
                               :before-upload="beforeInfoUpload">
                        <img v-if="infoList&&infoList[index-1]&&infoList[index-1].url"
                             :src="infoList[index-1].url" class="info-img">
                        <i v-else class="el-icon-plus avatar-uploader-icon info-i"></i>
                    </el-upload>
                    <div class="img-add" v-if="!(infoList&&infoList[index-1]&&infoList[index-1].url)"></div>
                    <div class="info-del" @click="delInfo(index-1)"></div>
                </div>
            </div>
            <div class="enroll-desc">可以上传4张图片，用于详情页补充（非必须上传）</div>
            <div class="enroll-tag" v-if="formList&&formList.length>0">填写联系信息</div>

            <!--联系信息=列表-->
            <div class="enroll-item" v-for="(item,index) in formList" v-if="item.useState"
                 :style="getFormItemStyle(item)">
                <!-- form表单==item -->
                <!-- 标题 -->
                <!--<div v-if="item.useState&&(item.viewType=='radio'||item.viewType=='select')"-->
                <!--class="form-title item-center">{{item.title}}-->
                <!--</div>-->
                <!-- 单行文本输入 -->
                <input @blur="inputBlur" @focus="inputFocus" v-if="item.viewType=='input'" class="enroll-input"
                       v-on:input="onFormInput($event)" type="input" :placeholder="'请输入'+item.title"
                       v-model="modelList[index]"/>
                <!-- 数字输入 -->
                <input @blur="inputBlur" @focus="inputFocus" v-if="item.viewType=='number'" min="0" class="enroll-input"
                       v-on:input="onFormInput($event,index)" type="input" :placeholder="'请输入'+item.title"
                       v-model="modelList[index]"/>
                <!-- 单选-->
                <div style="display:flex;flex-wrap:wrap;" v-if="item.viewType=='radio'">
                    <label class="item-center item-label" v-for="(itemradio,i) in item.refValues"
                           v-on:change="changeLabel($event,index)">
                        <input @blur="inputBlur" @focus="inputFocus" name="radio" type="radio" :value="itemradio.name"
                               v-model="modelList[index]"/>{{itemradio.name}}</label>
                </div>
                <!-- 多选 -->
                <div style="display:flex;flex-wrap:wrap;" v-if="item.viewType=='select'">
                    <label class="item-center item-label" v-for="(itemradio,i) in item.refValues"
                           v-on:change="changeLabel($event,index)">
                        <input @blur="inputBlur" @focus="inputFocus" name="checkbox" type="checkbox"
                               :value="itemradio.name"
                               v-model="modelList[index][i]"/>
                        <div class="label-txt">{{itemradio.name}}</div>
                    </label>
                </div>
                <!-- 日期选择器 -->
                <label class="item-end" v-if="item.viewType=='date'" v-on:change="changeLabel($event,index)">
                    <input @blur="inputBlur" @focus="inputFocus" name="date" type="date" v-model="modelList[index]"/>
                </label>
                <!-- 时间选择器 -->
                <label class="item-end" v-if="item.viewType=='time'" v-on:change="changeLabel($event,index)">
                    <input @blur="inputBlur" @focus="inputFocus" name="time" type="time" v-model="modelList[index]"/>
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
                          class="enroll-area" v-on:input="onFormInput($event)" :placeholder="'请输入'+item.title"
                          v-model="modelList[index]"></textarea>
            </div>
        </div>
        <div class="btn-sure" :style="enrollStyle.btnSubmit" @click="toSubmit()"></div>
        <div class="btn-home" :style="enrollStyle.btnBack" @click="toHome()"></div>
    </div>
</template>

<script>
    import app from '../js/app'
    import http from '../js/http'
    import util from '../js/util'
    import styleUtil from '../js/styles'

    let timer = null;
    export default {
        name: "Enroll",
        data() {
            return {
                showPage: 0,
                themeColor: {},
                enrollStyle: {},
                scanMode: 0, //是否为预览模式,0:不是,1:是
                activeFlag: 0,//活动状态,0未开始;1活动中;2报名结束
                verifyState: 0,//审核是否通过，0审核中，1通过，2不通过
                playerId: "",
                timerTxt: "",
                campaignConfig: null,
                enrollConfig: null,
                upImgNum: 0,
                player: {
                    nick: "",
                    desc: "",
                    name: "",
                    phone: "",
                },
                modelList: [],
                formData: {
                    campaignId: "",
                    worksImgList: [],//提交的图片
                    works: {
                        coverImg: "",//封面
                        worksName: "",//作品名称
                        worksDesc: "",//作品描述
                        competitorName: "",//参赛者姓名
                        competitorPhone: ""//参赛者手机号
                    },
                    enrollForms: [],//提交的表单
                },
                formList: [], //表单样式表
                dialogImageUrl: '',
                dialogVisible: false,
                infoList: [],
                imgIndex: -1,
                coverUrl: "",
                coverFile: "",
                uploadUrl: "",
                imageUrl: '', //图片预览路径
            }
        },
        created() {
            this.uploadUrl = app.getMiApiPath() + "mi/template/uploadImage";
            this.themeColor = util.getSession("vote2women_theme_color");
            http.readyShare(this);
        },
        mounted() {

        },
        methods: {
            shareCompleteNext() {
                this.checkCache();
                this.checkScan();
                this.setFocusData();
            },

            //检查是否为预览
            checkScan() {
                let channelId = util.getQueryString("channelId");
                if (!channelId || channelId == 0) {
                    this.scanMode = 1;
                }
            },

            //使用缓存数据
            checkCache() {
                let cacheData = util.getSession("vote2women_page5_data");
                if (util.isValid(cacheData)) {
                    this.setEnrollStyle(cacheData);
                } else {
                    this.getEnrollStyleData();
                }
            },

            setFocusData() {
                let isFocus = util.getSession("vote2women_subscribe_state");
                if (isFocus == 2) {
                    util.setSession("vote2women_subscribe_state", 1);
                }
            },

            // 获取首页样式
            getEnrollStyleData() {
                http._getPage(5).then(data => {
                    if (!data.data.status) {
                        this.$layer.msg(data.data.msg);
                        return false;
                    }
                    if (data.data.code == 200) {
                        util.setSession("vote2women_page5_data", data.data.data);
                        this.setEnrollStyle(data.data.data);
                    }
                });
            },

            // 设置首页样式
            setEnrollStyle(pageData) {
                this.enrollStyle = styleUtil.getEnrollStyle(pageData.pageItemList, pageData.pageDataRect);
                this.getCampaignConfig();
                this.getFormFormat();
            },

            //配置item的样式
            getFormItemStyle(formItem) {
                return {
                    flexDirection: formItem.viewType == 'select' || formItem.viewType == 'radio' ? 'column' : 'row',
                };
            },

            getFormFormat() {
                http._getFormFormat().then(data => {
                    if (data.data.status && data.data.code == 200) {
                        this.checkForm(data.data.data);
                    }
                });
            },

            checkForm(formList) {
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
                    });
                    this.formList = list;
                }
            },

            getEnrollDetail() {
                http._getEnrollDetail().then(data => {
                    if (data.data.status && data.data.code == 200) {
                        let playerData = data.data.data;
                        if (playerData && playerData.worksId) {
                            this.getPlayerData(playerData.worksId);
                        } else {
                            this.showPage = 1;
                        }
                    } else if (data.data.msg) {
                        this.$layer.msg(data.data.msg);
                    } else {
                        this.$layer.msg("服务器异常");
                    }
                });
            },

            getPlayerData(playerId) {
                http._getWorksDetail(playerId).then(data => {
                    if (data.data.status && data.data.code == 200) {
                        let pageData = data.data.data;
                        if (pageData.works) {
                            let playerData = pageData.works;
                            this.verifyState = playerData.isVerify;
                            this.coverUrl = playerData.coverImg;
                            this.player.nick = playerData.worksName;
                            this.player.desc = playerData.worksDesc;
                        }
                        if (pageData.worksImgs) {
                            let imgList = pageData.worksImgs;
                            for (let i = 0; i < imgList.length; i++) {
                                this.infoList[i] = {
                                    tag: "",
                                    url: imgList[i].imgUrl,
                                    file: ""
                                };
                            }
                        }

                        if (pageData.enrollForm) {
                            $.map(this.formList, (fromItem, index) => {
                                if (fromItem) {
                                    $.map(pageData.enrollForm, (item, key) => {
                                        if (item && key && fromItem.formItemCode == key) {
                                            this.modelList[index] = item;
                                        }
                                    });
                                }
                            });
                        }


                        this.showPage = 1;
                    } else if (data.data.msg) {
                        this.$layer.msg(data.data.msg);
                    } else {
                        this.$layer.msg("服务器异常");
                    }
                });
            },

            //活动配置
            getCampaignConfig() {
                http._getCampaignConfig().then(data => {
                    if (data.data.code == 200) {
                        let configData = data.data.data;
                        this.campaignConfig = configData.campaignConfig;
                        this.enrollConfig = configData.enrollConfig;
                        if (this.enrollConfig) {
                            this.upImgNum = this.enrollConfig.upImgNum;
                            this.setActiveFlag();
                            this.getEnrollDetail();
                        }
                    }
                });
            },

            setActiveFlag() {
                let st = util.countTime(this.enrollConfig.enrollStartTime, true);
                let et = util.countTime(this.enrollConfig.enrollEndTime, true);
                if (st > 0) {// 还没开始
                    this.activeFlag = 0;
                } else if (et < 0) {// 已经结束
                    this.activeFlag = 2;
                } else {
                    this.activeFlag = 1;
                }
                this.setActiveMsg();
            },

            setActiveMsg() {
                if (this.activeFlag == 0) {
                    this.timerTxt = '报名未开始';
                } else if (this.activeFlag == 2) {
                    this.timerTxt = '报名已结束';
                }
            },

            checkEnroll() {
                if (this.activeFlag == 1) {
                    return true;
                } else {
                    this.$layer.msg(this.timerTxt);
                    return false;
                }
            },

            toSubmit() {
                if (this.verifyState == 1) {
                    this.$layer.msg("审核通过，不可修改");
                    return;
                }
                if (!app.checkCampaignStatus(this.$layer, this.campaignConfig.status, this.scanMode)) return;
                if (!this.checkEnroll()) return;
                this.buildFormData();

            },

            //提交表单
            buildFormData() {
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
                    // console.log("buildFormData:", item, itemData);
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
                            // campaignId: util.getQueryString("campaignId"),
                            formItemCode: item.formItemCode,
                            // id: item.id,
                            // length: item.length ? item.length : 0,
                            // needState: item.needState,
                            // refValues: item.refValues,
                            // title: item.title,
                            // useState: item.useState,
                            // validateType: item.validateType,
                            // viewType: item.viewType,
                            value: itemData ? itemData : null,
                        };
                        index = index + 1;
                    }
                }

                // if (listData && listData.length > 0) {
                this.buildData(listData);
                // } else {
                //     this.$layer.msg("提交信息为空");
                // }
            },

            buildData(listData) {
                this.formData.campaignId = util.getQueryString("campaignId");
                for (let i = 0; i < this.infoList.length; i++) {
                    let item = this.infoList[i];
                    if (item) {
                        this.formData.worksImgList[i] = {
                            imgUrl: item.url
                        }
                    }
                }
                this.formData.works = {
                    coverImg: this.coverUrl,//封面
                    worksName: this.player.nick,//作品名称
                    worksDesc: this.player.desc,//作品描述
                };

                this.formData.enrollForms = listData;
                this.postForm();
                console.log("buildData", this.formData);
            },

            //确定--填写表单
            postForm() {
                http._postEnroll(this.formData).then(data => {
                    if (data.data.status && data.data.code == 200) {
                        this.$layer.msg("发布成功");
                        this.toHome();
                    } else if (data.data.msg) {
                        this.$layer.msg(data.data.msg);
                    } else {
                        this.$layer.msg("操作异常");
                    }
                });
            },

            toHome() {
                app.toPage(this, "home", "", true);
            },
            delCover() {
                this.coverUrl = "";
                this.coverFile = "";
            },
            delInfo(index) {
                this.infoList[index] = {};
                this.infoList = JSON.parse(JSON.stringify(this.infoList));
            },
            inputBlur(e) {
                if (timer) {
                    clearTimeout(timer);
                }
            },
            handleCoverSuccess(res, file) {
                this.handleSuccess(res, file, true);
            },
            handleCoverError(err, file, fileList) {
                console.log(err, file, fileList);
            },
            beforeCoverUpload(file) {
                this.beforeUpload(file, true);
            },
            handleInfoSuccess(res, file) {
                console.log("handleInfoSuccess", res, file);
                this.handleSuccess(res, file);
            },
            handleInfoError(err, file, fileList) {
                console.log(err, file, fileList);
            },
            beforeInfoUpload(file) {
                this.beforeUpload(file);
            },

            handleSuccess(res, file, isCover) {
                console.log("handleSuccess:", res, file);
                let index = -1;
                let tag = file.raw.path + file.raw.uid;
                for (let i = 0; i < this.infoList.length; i++) {
                    let item = this.infoList[i];
                    if (item && item.tag && item.tag == tag) {
                        index = i;
                    }
                }

                if (res.status && res.code == 200) {
                    let f = URL.createObjectURL(file.raw);
                    if (isCover) {
                        this.coverFile = f;
                        this.coverUrl = res.data;
                    } else if (index > -1) {
                        this.infoList[index].file = f;
                        this.infoList[index].url = res.data;
                    }
                    console.log("handleSuccess-1:", this.infoList);
                    this.infoList = JSON.parse(JSON.stringify(this.infoList));
                    console.log("handleSuccess-2:", this.infoList);
                } else {
                    this.$layer.msg("图片上传失败,请重新上传");
                }
            },
            beforeUpload(file, isCover) {
                this.$layer.msg("图片上传中");
                console.log("beforeUpload:", file);
                let title = isCover ? "封面" : "详情";
                let maxMbSize = 2;
                const isJPG = file.type === 'image/jpeg';
                const isPng = file.type === 'image/png';
                const isGif = file.type === 'image/gif';
                const isLt2M = file.size / 1024 / 1024 < maxMbSize;
                if (!isJPG && !isPng && !isGif) {
                    this.$layer.msg('上传' + title + '图片只能是JPG / PNG / GIF 格式!');
                }
                if (!isLt2M) {
                    this.$layer.msg('上传' + title + '图片大小不能超过 ' + maxMbSize + ' MB!');
                }

                let state = isLt2M && (isJPG || isPng || isGif);
                if (state) {
                    this.infoList[this.imgIndex] = {
                        tag: file.path + file.uid,
                        url: "",
                        file: ""
                    };
                }

                return state;
            },
            clickInfo(index) {
                this.imgIndex = index;
                console.log("clickInfo:", this.imgIndex);
            },
            inputFocus(e) {
                timer = setTimeout(() => {
                    document.body.scrollTop = 0;
                    window.pageYOffset = 0;
                    document.documentElement.scrollTop = 0;
                }, 100);
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
                    this.$layer.msg('上传头像图片只能是 JPG / PNG / GIF 格式!');
                }
                if (!isLt2M) {
                    this.$layer.msg("上传头像图片大小不能超过 " + maxMbSize + " MB!");
                }
                return isLt2M && (isJPG || isPng || isGif);
            }
        }
    }
</script>

<style>
    .enroll-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        /*background-color: #A66FF1;*/
        padding: 0.5rem 0.25rem;
        box-sizing: border-box;
    }

    .enroll-main {
        width: 100%;
        height: 100%;
        overflow: scroll;
        flex: 1;
        padding: 0.5rem;
        box-sizing: border-box;
        font-size: 0.22rem;
        border-radius: 0.05rem;
        background-color: white;
    }

    .enroll-tag {
        color: #4D4D4D;
        font-size: 0.28rem;
        font-weight: bold;
    }

    .enroll-desc {
        width: 100%;
        padding: 0.2rem 0.4rem 0.2rem 0;
        box-sizing: border-box;
        color: #d9d9d9;
        font-size: 0.22rem;
        line-height: 0.36rem;
    }

    .desc-small {
        margin-top: 0.1rem;
        font-size: 0.2rem;
    }

    .enroll-item {
        width: 100%;
    }

    .enroll-input, .enroll-area {
        width: 100%;
        border: none;
        margin-top: 0.2rem;
        padding: 0 0.25rem;
        box-sizing: border-box;
        color: #4D4D4D;
        background-color: #F2F2F2;
    }

    .enroll-input {
        height: 0.6rem;
        line-height: 0.6rem;
    }

    .enroll-area {
        height: 1.6rem;
        padding: 0.2rem 0.25rem;
        box-sizing: border-box;
    }

    .btn-sure, .btn-home {
        width: 7rem;
        height: 1rem;
        margin-top: 0.3rem;
    }

    .btn-home {
        /*background-image: url("../assets/page/enroll_home.png");*/
        background-size: 100% 100%;
    }

    .btn-sure {
        /*background-image: url("../assets/page/enroll_submit.png");*/
        background-size: 100% 100%;
    }

    /*上传图片*/
    .cover-content {
        display: flex;
        align-items: center;
    }

    .enroll-cover {
        width: 2.48rem;
        height: 1.73rem;
    }

    .cover-img, .cover-i {
        width: 2.25rem;
        height: 1.5rem;
    }

    .enroll-info {
        width: 1.6rem;
        height: 1.43rem;
    }

    .info-img, .info-i {
        width: 1.37rem;
        height: 1.2rem;
    }

    .el-upload i {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .enroll-cover, .enroll-info {
        position: relative;
        padding: 0.2rem 0.2rem 0 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .info-list {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .cover-del, .info-del {
        width: 0.46rem;
        height: 0.46rem;
        background-image: url("../assets/page/enroll_del.png");
        background-size: 100% 100%;
        z-index: 5;
        position: absolute;
        top: 0;
        right: 0;
    }

    .el-icon-plus {
        /*F2F2F2*/
        background-color: #dddddd;
    }

    .cover-add, .img-add {
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        background-image: url("../assets/page/enroll_add.png");
        background-size: 100% 100%;
        pointer-events: none;
    }

    .cover-add {
        z-index: 1;
        top: 0.73rem;
        left: 0.88rem;
    }

    .img-add {
        top: 0.58rem;
        left: 0.44rem;
    }

    .avatar-uploader .el-upload {
        z-index: 5;
        border: none;
        border-radius: 0;
    }

    .el-icon-plus:before {
        /*\E6D9*/
        content: "" !important;
    }

    .form-title {
        width: 25%;
        display: inline-block;
    }

    .item-center {
        display: flex;
        align-items: center;
    }

    .item-label {
        margin: 0.1rem 0.1rem 0.1rem 0;
        border: none;
    }

    .item-end {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .avatar {
        width: 0.6rem;
        height: 0.6rem;
        display: block;
    }
</style>
