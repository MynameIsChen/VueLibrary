<template>
    <div class="home">
        <div class="home-content" :style="themeColor">
            <div class="content-all">
                <Main ref="main" @set-theme="setThemeColor" @set-menu="setMenu" @show-home="showHome"
                      @show-alert="showAlertInfo" @show-menu="showMenu" v-if="infoTab==0"></Main>
                <Rank v-if="infoTab==1"></Rank>
                <Info v-if="infoTab==2"></Info>
                <About @change-tab="clickTab" v-if="infoTab==3"></About>
            </div>
            <div class="home-tabs" v-if="showMenuState == 1">
                <div :class="['item-tab']" @click="clickTab(index)" v-for="(item,index) in menuImgList"
                     v-if="checkMenuState(index)">
                    <div class="tab-icon">
                        <img class="tab-img" :src="menuImgList[index][infoTab==index?1:0]" alt="">
                    </div>
                </div>
            </div>
        </div>

        <!-- dialog组合 -->
        <div class="dialog" v-show="dialogType>0 || showAlertMsg==1">
            <LoadingDialog :dialogType="dialogType"></LoadingDialog>
            <AlertDialog :showAlertMsg="showAlertMsg" :alertInfo="alertInfo" :inputBlur="inputBlur"
                         :inputFocus="inputFocus" :closeAlert="closeAlert" :sureAlert="sureAlert">
            </AlertDialog>
        </div>
    </div>
</template>

<script>
    import app from '../js/app'
    import http from '../js/http'
    import util from '../js/util'

    import Main from '../components/Main'
    import Rank from '../components/Rank'
    import Info from '../components/Info'
    import About from '../components/About'
    import LoadingDialog from '../components/dialog/LoadingDialog'
    import AlertDialog from '../components/dialog/AlertDialog'

    let timer = null;

    export default {
        name: 'home',
        computed: {},
        components: {
            Main,
            Rank,
            Info,
            About,
            LoadingDialog,
            AlertDialog
        },
        data() {
            return {
                // 必备属性
                orderHeight: '',
                showPage: 0,
                themeColor: {},
                //dialog相关
                showAlertMsg: 0, //是否显示弹窗信息,0:不显示;1:显示
                infoTab: 0, //tab页:0首页,1:排行榜，2活动说明，3关注我们
                dialogType: 0, //0:无dialog,1:显示loading,2:显示活动说明/我的奖品,3:显示中奖状态,4话题详情，5奖品二维码，6奖品输入二维码,7摇一摇弹窗
                alertInfo: {}, //弹窗信息;0:通用样式;1:秘钥进入;2:截图审核;3:提交审核(2:暂时去掉-截图功能无法实现)
                //分页
                pageNum: 1, //分页页码
                pageSize: 10, //分页数量
                dataLoading: false, //数据加载中
                canLoadMore: true, //是否可以加载更多
                menuImgList: [],
                showMenuState: 0,//0不显示，1显示
                footAction: 0,//首页底部自定义按钮（0表示隐藏，1表示页面跳转，2表示一键关注）
                footActionImg: "",//按钮使用一键关注时的二维码图片
                footActionName: "",//底部自定义按钮名称
                footActionUrl: "",//按钮使用页面跳转时的链接
                topShowState: 0,//排行榜是否显示（''1''表示隐藏，''2''表示显示）
            }
        },
        created() {
            // 活动有效期 => 强制关注 => 人数限制 => 参与范围 => 活动秘钥 => 加载活动(loading) => 加载完成(取消loading)
            // 强制关注用之前的;人数限制暂不做;参与范围在开始游戏的时候处理
            // 结果： 活动有效期 => 活动秘钥 => 加载活动(loading) => 加载完成(取消loading)
            let homeShareReady = util.getSession("homeShareReady");
            this.orderHeight = util.resizeHeight();
            if (homeShareReady) {
                this.shareCompleteNext();
            } else {
                http.readyShare(this);
            }
        },
        mounted() {
            window.onresize = () => {
                this.orderHeight = util.resizeHeight();
            }
        },
        methods: {
            clickTab(index) {
                if (index == 3) {
                    if (this.footAction == 2 && util.isValid(this.footActionUrl)) { //页面跳转
                        window.location.href = this.footActionUrl;
                        return;
                    } else if (this.footAction == 3) { //一键关注
                        this.infoTab = index;
                    } else {
                        this.$layer.msg("配置错误");
                    }
                } else {
                    this.infoTab = index;
                }
            },

            shareCompleteNext() {
                util.setSession("homeShareReady", true);
                this.$nextTick(() => {
                    this.checkKeyNeedVerify(); //检验秘钥
                })
            },

            //检查秘钥是否需要验证
            checkKeyNeedVerify() {
                let checkKey = util.getSession("vote2women_check_key");
                if (checkKey == 1) {
                    this.showAlertInfo(1, "输入访问秘钥进入活动：");
                } else if (checkKey == 0) {
                    this.loadData();
                } else {
                    app.locationLogin();
                }
            },

            // 检查秘钥
            checkKey(secretKey) {
                if (!secretKey) {
                    this.$layer.msg("信息为空");
                    return;
                }
                http._verifyKey(secretKey).then(data => {
                    if (!data.data.status) {
                        this.$layer.msg(data.data.msg);
                        return;
                    }
                    if (data.data.code == 200) {
                        util.setSession("vote2women_check_key", 0);
                        this.closeAlert();
                        this.loadData();
                    }
                });
            },

            loadData() {
                //首页开始加载数据
                // this.$refs.main.loadMainData();
            },

            setThemeColor(colorStyle) {
                this.themeColor = colorStyle;
            },

            setMenu(menu) {
                this.menuImgList = menu;
            },

            //数据加载完成，显示页面、播放音乐、或者跳转
            showHome() {
                if (this.showPage == 0) {
                    util.autoPlayMusic("music");
                }
                this.showPage = 1;
                let playerId = util.getSession("vote2women_playerId");
                if (playerId) {
                    util.setSession("vote2women_playerId", "");
                    app.toPage(this, 'player', playerId);
                }
                this.closeDialog();
            },

            //显示底部菜单
            showMenu(footAction, footActionImg, footActionName, footActionUrl, topShowState) {
                this.showMenuState = 1;
                this.footAction = footAction;
                this.footActionImg = footActionImg;
                this.footActionName = footActionName;
                this.footActionUrl = footActionUrl;
                this.topShowState = topShowState;
            },

            checkMenuState(index) {
                if (index == 1) {//排行榜
                    return this.topShowState == 2;
                } else if (index == 3) {//关注我们
                    return this.footAction != 1;
                }
                return true;
            },

            // 配置alert的信息
            showAlertInfo(type, title) {
                this.showAlertMsg = 1;
                title = title ? title : "";
                type = type ? type : 0;
                this.alertInfo.alertType = type;
                this.alertInfo.alertTitle = title;
                if (this.alertInfo.alertType == 0) {
                    this.alertInfo.alertRightTxt = "知道了";
                } else if (this.alertInfo.alertType == 1) {
                    this.alertInfo.alertRightTxt = "进入活动";
                } else if (this.alertInfo.alertType == 2) {
                    this.alertInfo.alertRightTxt = "同意";
                    this.alertInfo.alertLeftTxt = "不同意";
                } else if (this.alertInfo.alertType == 3) {
                    this.alertInfo.alertRightTxt = "关闭";
                }
            },

            // 取消-alert的按钮
            closeAlert() {
                this.showAlertMsg = 0;
            },

            // 确认-alert的按钮
            sureAlert(secretKey) {
                if (this.alertInfo.alertType == 1) {
                    //输入秘钥；校验后关闭
                    this.checkKey(secretKey);
                } else {
                    this.closeAlert();
                }
            },

            //关闭dialog
            closeDialog() {
                this.dialogType = 0;
            },

            //解决输入框输入完成后留白
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
        }
    }
</script>

<style>
    @import url("../style/reset.css");
    @import url("../style/index.css");
    @import url("../style/dialog.css");

    html,
    body,
    .home {
        height: 100%;
        width: 100%;
    }
</style>
