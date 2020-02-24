<template>
    <div class="player-content" :style="themeColor" v-if="showPage == 1">
        <div class="player-time">{{timerTxt}}</div>
        <div class="player-scroll">
            <div class="player-info">
                <div class="player-head">
                    <img class="player-icon" v-if="playerData.coverImg||playerData.headimgurl"
                         :style="playerStyle.avatar"
                         :src="playerData.headimgurl?playerData.headimgurl:playerData.coverImg" alt=" ">
                    <div class="head-info">
                        <div class="player-order" :style="playerStyle.order">{{playerData.worksId}}号</div>
                        <div class="player-nick" :style="playerStyle.nick">{{playerData.worksName}}</div>
                    </div>
                    <div class="player-num" :style="playerStyle.num">{{voteNum}}票</div>
                </div>
                <div class="player-desc" :style="playerStyle.desc">{{playerData.worksDesc}}</div>
                <img class="player-cover" v-if="playerData.coverImg" :src="playerData.coverImg" alt=" ">
                <img class="player-img" v-if="item.imgUrl" :src="item.imgUrl" alt=" " v-for="item in detailImgList">
            </div>

            <div class="player-home" :style="playerStyle.btnBack" @click="toHome()"></div>
        </div>
        <div class="player-state">
            <div class="player-state-txt" v-if="isMine&&verifyState!=1">{{verifyState==0?'该作品审核中……':'该作品不通过……'}}</div>
            <div class="player-edit" v-if="isMine&&verifyState!=1" @click="doEdit()">修改信息</div>
            <div class="player-btn" :style="isMine?shareStyle.btnInvite:playerStyle.btnVote"
                 v-if="!isMine || verifyState==1" @click="doVote()"></div>
        </div>

        <div class="player-dialog" @click.self="doOuter()" v-if="verifyState==1&&showDialog==1">
            <div class="dialog-content" :style="shareStyle.bg">
                <div class="dialog-cover" :style="shareStyle.cover"></div>
                <div class="dialog-desc" :style="shareStyle.desc">我是01号{{playerData.worksName}}，快来为我投票吧</div>
                <div class="dialog-code">
                    <div class="qrcode-parent">
                        <div class="qrcode-canvas"></div>
                        <div class="qrcode-img"></div>
                    </div>
                    <div class="code-txt">长按识别二维码为TA投票</div>
                </div>
            </div>
            <div class="dialog-txt">也可以长按保存图片发给小伙伴邀请他们为你投票</div>
        </div>
    </div>
</template>

<script>
    import app from '../js/app'
    import http from '../js/http'
    import util from '../js/util'
    import styleUtil from '../js/styles'
    import QRCode from "qrcodejs2"

    let interval = null;

    export default {
        name: "Player",
        data() {
            return {
                showPage: 0,
                playerId: null,
                scanMode: 0, //是否为预览模式,0:不是,1:是
                verifyState: 0,//审核是否通过，0审核中，1通过，2不通过
                showDialog: 0,//是否显示dialog，0不显示，1显示
                isMine: false,//是否是自己
                playerStyle: {},
                shareStyle: {},
                voteConfig: null,
                enrollConfig: null,
                activeFlag: 0,//活动状态,0未开始;1活动中;2报名结束
                timerTxt: "",
                themeColor: {},
                voteNum: 0,//获得票数
                playerData: {},
                detailImgList: [],
            }
        },
        created() {
            document.title = util.getSession("vote2women_campaign_title");
            this.playerId = util.getQueryString("playerId");
            if (!this.playerId) {
                this.isMine = true;
            }
            http.readyShare(this);
        },
        mounted() {

        },
        methods: {
            shareCompleteNext() {
                this.checkCache();
                this.checkScan();
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
                let page6CacheData = util.getSession("vote2women_page6_data");
                let page7CacheData = util.getSession("vote2women_page7_data");
                if (util.isValid(page6CacheData)) {
                    this.setPlayerStyle(page6CacheData);
                } else {
                    this.getPlayerStyleData();
                }
                if (util.isValid(page7CacheData)) {
                    this.setShareStyle(page7CacheData);
                } else {
                    this.getShareStyleData();
                }
            },

            // 获取首页样式
            getPlayerStyleData() {
                // 6选手详情/7分享/8我的(不用配置)
                http._getPage(6).then(data => {
                    if (!data.data.status) {
                        this.$layer.msg(data.data.msg);
                        return false;
                    }
                    if (data.data.code == 200) {
                        util.setSession("vote2women_page6_data", data.data.data);
                        this.setPlayerStyle(data.data.data);
                    }
                });
            },

            // 获取首页样式
            getShareStyleData() {
                // 6选手详情/7分享/8我的(不用配置)
                http._getPage(7).then(data => {
                    if (!data.data.status) {
                        this.$layer.msg(data.data.msg);
                        return false;
                    }
                    if (data.data.code == 200) {
                        util.setSession("vote2women_page7_data", data.data.data);
                        this.setShareStyle(data.data.data);
                    }
                });
            },

            // 设置首页样式
            setPlayerStyle(pageData) {
                this.themeColor = util.getSession("vote2women_theme_color");
                this.playerStyle = styleUtil.getPlayerStyle(pageData.pageItemList, pageData.pageDataRect);
                if (this.isMine) {
                    this.getEnrollDetail();
                } else {
                    this.getPlayerData();
                }

                this.getCampaignConfig();
            },

            // 设置首页样式
            setShareStyle(pageData) {
                this.shareStyle = styleUtil.getShareStyle(pageData.pageItemList, pageData.pageDataRect);
            },

            getEnrollDetail() {
                http._getEnrollDetail().then(data => {
                    if (data.data.status && data.data.code == 200) {
                        let enrollData = data.data.data;
                        this.playerId = enrollData.worksId;
                        this.getPlayerData();
                    } else if (data.data.msg) {
                        this.$layer.msg(data.data.msg);
                    } else {
                        this.$layer.msg("服务器异常");
                    }
                });
            },

            getPlayerData() {
                http._getWorksDetail(this.playerId).then(data => {
                    if (data.data.code == 200) {
                        let pageData = data.data.data;
                        this.voteNum = pageData.curAmount;
                        if (pageData.works) {
                            let token = util.getSession("vote2women_token");
                            this.playerData = pageData.works;
                            this.isMine = token == this.playerData.worksUserId;
                            this.verifyState = this.playerData.isVerify;
                        }
                        if (pageData.worksImgs) {
                            this.detailImgList = pageData.worksImgs;
                        }
                        this.showPage = 1;
                    }
                });
            },

            //判断有效期
            getCampaignConfig() {
                http._getCampaignConfig().then(data => {
                    if (data.data.code == 200) {
                        let homeData = data.data.data;
                        this.voteConfig = homeData.voteConfig;
                        this.enrollConfig = homeData.enrollConfig;
                        this.campaignConfig = homeData.campaignConfig;
                        if (this.voteConfig) {
                            this.readyTimer();
                        }
                    }
                });
            },

            // 发起投票
            toVote() {
                if (this.playerId) {
                    http._vote(this.playerId).then(data => {
                        if (data.data.status && data.data.code == 200) {
                            this.$layer.msg("投票成功");
                        } else if (data.data.msg) {
                            //条件限制，及错误操作
                            this.$layer.msg(data.data.msg);
                        } else {
                            this.$layer.msg("服务器异常");
                        }
                    })
                }
            },

            // 准备倒计时
            readyTimer() {
                let tStart = util.countTime(this.voteConfig.voteStartTime, true);
                let tEnd = util.countTime(this.voteConfig.voteEndTime, true);

                if (tStart > 0) {
                    //活动还未开始
                    this.activeFlag = 0;
                } else {
                    if (tEnd >= 0) {
                        //活动中
                        this.activeFlag = 1;
                        this.startTimer();
                    } else {
                        //报名结束
                        this.activeFlag = 2;
                    }
                }
                this.setActiveMsg();
            },

            //修正提示文字
            setActiveMsg() {
                if (this.activeFlag == 0) {
                    this.timerTxt = '投票未开始';
                } else if (this.activeFlag == 2) {
                    this.timerTxt = '投票已结束';
                }
            },

            // 开始倒计时
            startTimer() {
                //先停止再开始
                if (interval !== null) {
                    clearInterval(interval);
                }
                this.setTimerData();
                interval = setInterval(() => {
                    this.setTimerData();
                }, 60000);
            },

            setTimerData() {
                let t = util.countTime(this.voteConfig.voteEndTime, true);
                if (t <= 0) {
                    this.activeFlag = 2;
                    clearInterval(interval);
                } else {
                    this.activeFlag = 1;
                    this.timerTxt = "投票结束倒计时：" + util.countDown(t, true);
                }
            },

            toHome() {
                this.$router.back(-1);
            },
            doEdit() {
                app.toPage(this, "enroll", "", true);
            },
            checkVote() {
                if (this.activeFlag == 1) {
                    return true;
                } else {
                    this.$layer.msg(this.timerTxt);
                    return false;
                }
            },
            doVote() {
                if (!app.checkCampaignStatus(this.$layer, this.campaignConfig.status, this.scanMode)) return;
                if (!this.checkVote()) return;
                if (this.isMine) {
                    this.showDialog = 1;
                    this.$nextTick(() => {
                        timer = setTimeout(() => {
                            this.drawQRCode();
                        }, 300);
                    });
                } else {
                    //投票
                    this.toVote();
                }
            },
            doOuter() {
                this.showDialog = 0;
            },
            //绘制二维码
            drawQRCode() {
                let qrcode = $('.qrcode-canvas')[0];
                let codeimg = $('.qrcode-img')[0];
                let url = app.getIndex();

                new QRCode(qrcode, {
                    text: url,
                    width: qrcode.clientHeight,
                    height: qrcode.clientHeight,
                    render: "canvas", //渲染方式指定canvas方式
                    typeNumber: -1, //计算模式
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    // transparent
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
        }
    }
</script>

<style scoped>
    .player-content {
        width: 100%;
        height: 100%;
        font-size: 0.28rem;
        color: black;
        /*background-color: #A66FF1;*/
        display: flex;
        flex-direction: column;
    }

    .player-time {
        width: 7rem;
        height: 0.5rem;
        margin: 0.5rem 0.25rem 0.2rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0.05rem;
        line-height: 0.5rem;
        text-align: center;
        color: white;
    }

    .player-scroll {
        flex: 1;
        overflow: auto;
    }

    .player-info {
        width: 7rem;
        margin: 0.2rem 0.25rem 0.5rem;
        background-color: #ffffff;
        border-radius: 0.05rem;
        padding: 0.5rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .player-head {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .player-icon {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 1.2rem;
    }

    .head-info {
        margin-left: 0.28rem;
        flex: 1;
    }

    .player-order {
        color: #F16F93;
        font-size: 0.42rem;
        font-weight: bold;
    }

    .player-nick {
        color: #B3B3B3;
        font-size: 0.32rem;
    }

    .player-num {
        color: #E6DB5F;
        font-size: 0.72rem;
        font-weight: bold;
    }

    .player-desc {
        color: #b3b3b3;
        font-size: 0.22rem;
        margin-top: 0.32rem;
    }

    .player-cover, .player-img {
        width: 100%;
    }

    .player-cover {
        margin-top: 0.5rem;
    }

    .player-img {
        margin-top: 0.2rem;
    }

    .player-home {
        width: 7rem;
        height: 1rem;
        margin: 0.4rem auto 1.48rem;
        background-image: url("../assets/page/player_back_home.png");
        background-size: 100% 100%;
    }

    .player-state {
        width: 100%;
        height: 1rem;
        position: fixed;
        bottom: 0;
        background-color: #FFFFFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .player-state-txt {
        margin-left: 0.56rem;
        color: #b3b3b3;
    }

    .player-edit {
        margin-right: 0.56rem;
        color: #333333;
    }

    .player-btn {
        width: 100%;
        height: 100%;
        /*background-image: url("../assets/page/player_detail_vote.png");*/
        background-size: 100% 100%;
    }

    /*.player-invite {*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*background-image: url("../assets/page/player_detail_invite.png");*/
    /*background-size: 100% 100%;*/
    /*}*/

    /*dialog*/
    .player-dialog {
        width: 100%;
        height: 100%;
        position: fixed;
        overflow: scroll;
        top: 0;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .dialog-content {
        width: 6rem;
        margin: 1rem auto 0;
        background-color: white;
    }

    .dialog-cover {
        /*width: 5rem;*/
        background-size: 100% 100%;
    }

    .dialog-desc {
        width: 100%;
        padding: 0.4rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
    }

    .dialog-code {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 0.5rem 0.5rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .qrcode-parent {
        width: 1.4rem;
        height: 1.4rem;
        border: 0.01rem solid black;
        border-radius: 0;
    }

    .qrcode-canvas,
    .qrcode-img {
        width: 1.3rem;
        height: 1.3rem;
        position: absolute;
        top: 0.05rem;
        left: 0.05rem;
    }

    .code-txt {
        flex: 1;
        margin-left: 0.5rem;
        text-align: center;
        line-height: 0.4rem;
        color: white;
    }

    .dialog-txt {
        width: 4rem;
        line-height: 0.4rem;
        margin: 0.4rem auto 0.2rem;
        text-align: center;
        color: white;
    }
</style>
