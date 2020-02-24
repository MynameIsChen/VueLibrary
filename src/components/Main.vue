<template>
    <div class="main-content">
        <audio id="music" loop preload autoplay type="audio/mpeg" hidden crossorigin="anonymous"></audio>

        <el-carousel trigger="click" :height="mainStyle.bannerHeight">
            <el-carousel-item v-for="(item,index) in mainStyle.banner" :key="index">
                <div class="banner-item" :style="getBannerItemStyle(item)"></div>
            </el-carousel-item>
        </el-carousel>
        <div class="main-time">{{timerTxt}}</div>
        <div class="main-num">
            <div class="num-item">
                <div :style="mainStyle.joinTitle">报名人数</div>
                <div class="num-txt" :style="mainStyle.joinText">{{joinNum}}</div>
            </div>
            <div class="num-line"></div>
            <div class="num-item">
                <div :style="mainStyle.voteTitle">累计投票</div>
                <div class="num-txt" :style="mainStyle.voteText">{{voteNum}}</div>
            </div>
        </div>
        <div>
            <div class="main-input">
                <img class="input-icon" src="../assets/page/icon_search.png" alt="">
                <input class="input-content" type="text" v-model="searchText" @input="onInputListener($event)"
                       placeholder="请输入名称">
            </div>

            <div class="main-list" :style="mainStyle.listBgColor">
                <div class="main-tabs" v-if="mainStyle.listTitle">
                    <div class="item-tab" v-for="(sort,index) in sortRule"
                         :style="mainStyle.listTitle[tabIndex==index?0:1]" @click="clickTab(index)">
                        {{getSortTitle(sort)}}
                    </div>
                </div>
                <div class="list-content">
                    <div class="item-content" v-for="item in playerList" @click.self="clickItem(item)"
                         :style="itemStyle.item">
                        <img @click.self="clickItem(item)" class="item_player_cover" :style="itemStyle.itemIcon"
                             :src="item.coverImg" alt="">
                        <div @click.self="clickItem(item)" class="item_vote">
                            <div class="item_player_nick one-line" :style="itemStyle.itemNick">{{item.worksName}}</div>
                            <div class="item_player_num" :style="itemStyle.itemNum">{{item.curAmount}}票</div>
                        </div>
                        <!--两种状态：itemBtn、itemBtnVote-->
                        <div class="bt_vote" @click="voteItem(item)" :style="itemStyle.itemBtn"></div>
                        <div class="item_player_order" :style="itemStyle.itemTag">{{item.rank}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!--报名、我的-->
        <div class="float-btn" v-if="floatState>0&&enrollAble==1&&mainStyle.floatBg"
             :style="mainStyle.floatBg[floatState==1?0:1]"
             @click="toJoin()"></div>
        <!-- 浮层-重定义部分按钮 -->
        <FloatDialog :scanMode="scanMode" :onMusic="onMusic" :onFeedback="onFeedback" :mainStyle="mainStyle"
                     :musicType="musicType"></FloatDialog>
    </div>
</template>

<script>
    import app from '../js/app'
    import util from '../js/util'
    import http from '../js/http'
    import styleUtil from '../js/styles'

    import FloatDialog from '../components/dialog/FloatDialog'

    let interval = null;
    let timer = null;

    export default {
        name: "Main",
        data() {
            return {
                showMain: 0,
                tabIndex: 0,
                sortRule: [],//允许排序规则
                // 页面属性
                page1Data: null,
                mainStyle: {}, //主样式
                itemStyle: {},
                musicType: 1,
                campaignConfig: null,
                voteConfig: null,
                scanMode: 0, //是否为预览模式,0:不是,1:是
                //活动状态（0 删除（放入回收站）  1 未发布  2 已发布  3 关闭 4 永久删除）
                activeFlag: 0,//活动状态,0未开始;1活动中;2报名结束
                floatState: 0,//按钮显示状态，0不显示，1报名，2我的
                enrollAble: 0,//是否开启报名设置；0表示不开启，1表示开启
                needFocus: 0,//报名是否需要关注公众号（''0''不需要，''1''需要）
                isFocus: 0,//是否关注了公众号，0未关注，1已关注,2已关注并跳至报名页
                timerTxt: "",
                joinNum: 0,
                voteNum: 0,
                searchText: "",
                playerList: [],
                allList: [],
            };
        },
        created() {
            this.loadMainData();
        },
        components: {
            FloatDialog,
        },
        methods: {
            //加载首页相关资源
            loadMainData() {
                document.title = util.getSession("vote2women_campaign_title");
                this.dialogType = 1; // 显示loading层
                this.isFocus = util.getSession("vote2women_subscribe_state");
                this.checkScan(); //添加预览状态
                this.checkCache(); //首页
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
                let cacheData = util.getSession("vote2women_page1_data");
                if (util.isValid(cacheData)) {
                    this.page1Data = cacheData;
                    this.setHomeStyle();
                } else {
                    this.getHomeStyleData();
                }
            },

            // 获取首页样式
            getHomeStyleData() {
                http._getPage(1).then(data => {
                    if (!data.data.status) {
                        this.$layer.msg(data.data.msg);
                        return false;
                    }
                    if (data.data.code == 200) {
                        util.setSession("vote2women_page1_data", data.data.data);
                        this.page1Data = data.data.data;
                        this.setHomeStyle();
                    }
                });
            },

            // 设置首页样式
            setHomeStyle() {
                let style = styleUtil.getHomeStyle(this.page1Data.pageItemList, this.page1Data.pageDataRect);
                util.setSession("vote2women_theme_color", style.mainStyle.themeColor);
                this.mainStyle = style.mainStyle;
                this.itemStyle = style.playerItemStyle;
                this.$emit("set-menu", this.mainStyle.menu);
                this.$emit("set-theme", this.mainStyle.themeColor);
                this.getCampaignConfig();
                this.getEnrollNum();
                this.readyMusic();
                if (this.isFocus == 2) {
                    app.toPage(this, 'enroll');
                }
            },

            //获取首页数据
            getCampaignConfig() {
                http._getCampaignConfig().then(data => {
                    if (data.data.code == 200) {
                        let homeData = data.data.data;
                        let baseConfig = homeData.baseConfig;
                        this.voteConfig = homeData.voteConfig;
                        if (homeData.enrollConfig) {
                            this.needFocus = homeData.enrollConfig.needFocus;
                        }
                        this.campaignConfig = homeData.campaignConfig;
                        if (baseConfig) {
                            this.sortRule = baseConfig.sortRule;
                            this.enrollAble = baseConfig.enrollByMobileState;
                            let type = Object.prototype.toString.call(this.sortRule);
                            if (type !== "[object Array]") {
                                this.sortRule = JSON.parse(this.sortRule);
                            }
                            util.setSession("vote2women_follow_img", baseConfig.footActionImg);
                            this.$emit("show-menu", baseConfig.footAction, baseConfig.footActionImg, baseConfig.footActionName, baseConfig.footActionUrl, baseConfig.topShowState);
                            this.getPlayerList(this.tabIndex);
                            this.getEnrollDetail();
                        }
                        if (this.voteConfig) {
                            this.readyTimer();
                        }

                        this.$nextTick(() => {
                            timer = setTimeout(() => {
                                clearTimeout(timer);
                                this.getEnrollNum();
                                this.readyMusic();
                                this.$emit("show-home");
                            }, 300);
                        });
                    }
                });
            },

            getEnrollDetail() {
                http._getEnrollDetail().then(data => {
                    if (data.data.status && data.data.code == 200) {
                        let playerData = data.data.data;
                        if (playerData && playerData.worksId) {
                            this.floatState = 2;
                        } else {
                            this.floatState = 1;
                        }

                    } else if (data.data.msg) {
                        this.$layer.msg(data.data.msg);
                    } else {
                        this.$layer.msg("服务器异常");
                    }
                });
            },

            getEnrollNum() {
                http._getEnrollNum().then(data => {
                    if (data.data.code == 200) {
                        let enrollData = data.data.data;
                        this.voteNum = enrollData.allVotes;
                        this.joinNum = enrollData.enrollNum;
                    }
                });
            },

            onInputListener(event) {
                this.getPlayerList(this.tabIndex);
            },
            getPlayerList(index) {
                let type = this.sortRule[index];
                //排序规则（1表示最新参赛，2表示人气排行，3表示参赛顺序）
                // 先用cache的数据，再使用实时的数据
                this.playerList = this.allList[index];
                http._getWorksList(type, this.searchText).then(data => {
                    if (data.data.code == 200) {
                        let listData = data.data.data;
                        this.allList[index] = listData;
                        this.playerList = listData;
                    }
                });
            },

            getSortTitle(sortType) {
                if (sortType == '1') {
                    return "最新参赛";
                } else if (sortType == '2') {
                    return "人气排行";
                } else if (sortType == '3') {
                    return "参赛顺序";
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

            addScrollListener() {
                let element = document.getElementById("history-content");
                element.addEventListener("scroll", e => {
                    let a = util.getScrollHeight(element);
                    let b = util.getScrollTop(element) + util.getClientHeight(element);
                    if (a - b < 10) {
                        //发生加载更多
                    }
                })
            },

            // 发起投票
            toVote(item) {
                if (!app.checkCampaignStatus(this.$layer, this.campaignConfig.status, this.scanMode)) return;
                if (!this.checkVote()) return;
                if (item && item.worksId) {
                    http._vote(item.worksId).then(data => {
                        if (data.data.status && data.data.code == 200) {
                            this.$layer.msg("投票成功");
                            timer = setTimeout(() => {
                                this.getEnrollNum();
                                this.getPlayerList(this.tabIndex);
                            }, 300);
                        } else if (data.data.msg) {
                            //条件限制，及错误操作
                            this.$emit('show-alert', 0, data.data.msg);
                        }
                    })
                }
            },

            getBannerItemStyle(item) {
                return {
                    backgroundImage: 'url(' + item + ')',
                    backgroundSize: '100% 100%',
                }
            },
            clickTab(index) {
                this.tabIndex = index;
                this.getPlayerList(index);
            },
            clickItem(item) {
                app.toPage(this, 'player', item.worksId);
            },
            voteItem(item) {
                this.toVote(item);
            },

            checkVote() {
                if (this.activeFlag == 1) {
                    return true;
                } else {
                    this.$layer.msg(this.timerTxt);
                    return false;
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

            toJoin() {
                if (!app.checkCampaignStatus(this.$layer, this.campaignConfig.status, this.scanMode)) return;
                if (!this.checkEnroll()) return;
                if (this.floatState == 1) {
                    if (this.needFocus == 1 && this.isFocus == 0) {
                        app.locationSubscribe();
                        return;
                    } else {
                        app.toPage(this, 'enroll');
                        return;
                    }
                } else {
                    app.toPage(this, 'player');
                }
            },

            readyMusic() {
                let mainMusic = document.getElementById("music");
                if (mainMusic) {
                    mainMusic.src = require("assets/a.mp3");
                    mainMusic.load();
                }
            },

            // 音乐按钮开关
            onMusic() {
                if ($(".float-music").hasClass("music-on")) {
                    this.musicControl(false);
                } else if ($(".float-music").hasClass("music-off")) {
                    this.musicControl(true);
                }
            },

            // 投诉
            onFeedback() {
                this.musicControl(false);
                app.toPage(this, 'feedback');
            },

            musicControl(on) {
                if (on) {
                    this.onOffMusicEffect(true);
                    this.onOffMusic(true, "music");
                } else {
                    this.onOffMusicEffect(false);
                    this.onOffMusic(false, "music");
                }
            },

            //音乐开关效果
            onOffMusicEffect(on) {
                if (on) {
                    //打开图片+开启动画效果+开启音乐
                    $(".float-music").removeClass("music-off");
                    $(".float-music").addClass("music-on");
                    $(".float-music").addClass("circle");
                    this.musicType = 1;
                } else {
                    //关闭图标+关闭动画效果+关闭音乐
                    $(".float-music").removeClass("music-on");
                    $(".float-music").removeClass("circle");
                    $(".float-music").addClass("music-off");
                    this.musicType = 0;
                }
            },

            // 音乐开关
            onOffMusic(on, id) {
                // 关闭开启音乐
                let musicAudio = document.getElementById(id);
                if (musicAudio) {
                    if (on) {
                        musicAudio.play();
                    } else {
                        musicAudio.pause();
                    }
                }
            },
        }
    }
</script>

<style>
    @import url("../style/reset.css");
    @import url("../style/dialog.css");

    .main-content {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .banner-item {
        width: 100%;
        height: 100%;
    }

    .float-btn {
        width: 1rem;
        height: 1rem;
        z-index: 10;
        line-height: 1rem;
        position: fixed;
        top: 6rem;
        right: 0.25rem;
        /*background-image: url("../assets/page/main_join.png");*/
        /*background-image: url("../assets/page/float_mine.png");*/
        background-size: 100% 100%;
    }

    .main-time {
        width: 5.5rem;
        height: 0.5rem;
        margin: 0.77rem 0.75rem 0.88rem;
        line-height: 0.5rem;
        border-radius: 0.5rem;
        color: white;
        font-size: 0.26rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .main-num {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: white;
        font-size: 0.34rem;
    }

    .num-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .num-txt {
        margin-top: 0.12rem;
        /*font-size: 0.9rem;*/
        /*font-weight: bold;*/
        /*color: #FFF473;*/
    }

    .num-line {
        width: 0.02rem;
        height: 1rem;
        background-color: white;
    }

    .main-input {
        width: 7rem;
        height: 0.8rem;
        margin: 1rem 0.25rem 0.6rem;
        border-radius: 0.05rem;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
    }

    .input-icon {
        width: 0.3rem;
        height: 0.3rem;
        margin-left: 0.34rem;
    }

    .input-content {
        line-height: 0.8rem;
        padding: 0 0.2rem;
        box-sizing: border-box;
        color: white;
        border: none;
        font-size: 0.24rem;
        display: flex;
        align-items: center;
        flex: 1;
        background-color: transparent;
    }

    .main-list {
        width: 7rem;
        margin: 0 0.25rem 0.2rem;
        background-color: white;
        border-radius: 0.05rem;
    }

    .main-tabs {
        width: 7rem;
        display: flex;
        justify-content: space-evenly;
    }

    .item-tab {
        width: 1.2rem;
        height: 0.5rem;
        margin-top: 0.22rem;
        line-height: 0.5rem;
        text-align: center;
        /*color: #cccccc;*/
        /*font-size: 0.28rem;*/
    }

    .select-tab {
        /*color: #f16f93;*/
        /*border-bottom: 0.01rem #f16f93 solid;*/
    }

    .list-content {
        width: 7rem;
        min-height: 5.52rem;
        padding: 0.36rem 0.4rem;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .item-content {
        /*width: 3rem;*/
        /*height: 4.4rem;*/
        position: relative;
        /*background-image: url("../assets/page/item_bg.png");*/
        background-size: 100% 100%;
        margin-bottom: 0.2rem;
        padding: 0.5rem 0.2rem 0.2rem;
        box-sizing: border-box;
    }

    .item_player_cover {
        /*width: 2.6rem;*/
        /*height: 2.4rem;*/
    }

    .item_vote {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 0.18rem;
    }

    .item_player_nick {
        max-width: 1.8rem;
        /*color: white;*/
        /*font-size: 0.24rem;*/
    }

    .item_player_num {
        flex: 1;
        /*color: #D3F15B;*/
        /*font-size: 0.26rem;*/
        text-align: end;
    }

    .bt_vote {
        width: 100%;
        /*height: 0.6rem;*/
        margin-top: 0.2rem;
        /*background-image: url("../assets/page/item_vote.png");*/
        background-size: 100% 100%;
    }

    .item_player_order {
        width: 0.8rem;
        height: 0.4rem;
        position: absolute;
        top: 0;
        left: 0.2rem;
        /*background-image: url("../assets/page/main_item_tag.png");*/
        background-size: 100% 100%;
        /*color: white;*/
        /*font-size: 0.24rem;*/
        line-height: 0.4rem;
        text-align: center;
    }

</style>
