<template>
    <div class="rank-content">
        <div class="rank-time">{{timerTxt}}</div>
        <div class="rank-title" :style="headStyle"></div>
        <div class="rank-list">
            <div class="list-item" v-for="(item,index) in rankList">
                <div class="item-order" v-if="rankItemStyle.rankOrder">
                    <div class="order-img" :style="rankItemStyle.rankOrder[index>2?0:index+1]">{{index>2?index+1:''}}
                    </div>
                </div>
                <div class="item-player">
                    <img class="player-avatar" :style="rankItemStyle.rankAvatar"
                         :src="item.headimgurl?item.headimgurl:item.coverImg" alt=" ">
                    <div class="player-nick one-line" :style="rankItemStyle.rankNick">{{item.worksName}}</div>
                </div>
                <div class="item-num" :style="rankItemStyle.rankNum">{{item.curAmount}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '../js/http'
    import util from '../js/util'
    import styleUtil from '../js/styles'

    let interval = null;

    export default {
        name: "Rank",
        data() {
            return {
                voteConfig: null,
                headStyle: {},
                rankItemStyle: {},
                activeFlag: 0,//活动状态,0未开始;1活动中;2报名结束
                timerTxt: "",
                rankList: []
            }
        },
        created() {
            this.checkCache();
        },
        methods: {
            //使用缓存数据
            checkCache() {
                let cacheData = util.getSession("vote2women_page2_data");
                if (util.isValid(cacheData)) {
                    this.setRankStyle(cacheData);
                } else {
                    this.getRankStyleData();
                }
            },

            // 获取首页样式
            getRankStyleData() {
                http._getPage(2).then(data => {
                    if (!data.data.status) {
                        this.$layer.msg(data.data.msg);
                        return false;
                    }
                    if (data.data.code == 200) {
                        util.setSession("vote2women_page2_data", data.data.data);
                        this.setRankStyle(data.data.data);
                    }
                });
            },

            // 设置首页样式
            setRankStyle(pageData) {
                let style = styleUtil.getRankStyle(pageData.pageItemList, pageData.pageDataRect);
                this.headStyle = style.headStyle;
                this.rankItemStyle = style.rankItemStyle;

                this.getRankData();
                this.getCampaignConfig();
            },

            getRankData() {
                http._getRankList().then(data => {
                    if (data.data.code == 200) {
                        this.rankList = data.data.data;
                    }
                });
            },

            //获取首页数据
            getCampaignConfig() {
                http._getCampaignConfig().then(data => {
                    if (data.data.code == 200) {
                        this.voteConfig = data.data.data.voteConfig;
                        this.readyTimer();
                    }
                });
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
        }
    }
</script>

<style scoped>
    .rank-content {
        height: 100%;
        /*background-color: #a66ff1;*/
        display: flex;
        flex-direction: column;
        font-size: 0.28rem;
        color: #000;
    }

    .rank-time {
        width: 7rem;
        height: 0.5rem;
        margin-left: 0.25rem;
        margin-top: 0.5rem;
        line-height: 0.5rem;
        border-radius: 0.05rem;
        color: white;
        font-size: 0.26rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .rank-title {
        /*width: 7rem;*/
        /*height: 1.73rem;*/
        margin: 0.4rem 0.25rem 0;
        /*background-image: url("../assets/page/rank_head.png");*/
        background-size: 100% 100%;
    }

    .rank-list {
        width: 7rem;
        flex: 1;
        margin: 0.2rem 0.25rem;
        padding: 0 0.2rem 0.2rem;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 0.05rem;
        overflow: scroll;
    }

    .list-item {
        width: 100%;
        height: 1.4rem;
        padding: 0 0.15rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.01rem #e6e6e6 solid;
    }

    .item-order {
        width: 1rem;
        height: 1.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        /*color: #999999;*/
        /*font-size: 0.36rem;*/
    }

    .order-img {
        /*width: 0.98rem;*/
        /*height: 0.95rem;*/
        background-size: 100% 100%;
    }

    .item-player {
        display: flex;
        align-items: center;
    }

    .player-avatar {
        /*width: 0.9rem;*/
        /*height: 0.9rem;*/
    }

    .player-nick {
        max-width: 2.5rem;
        /*color: #333333;*/
        margin-left: 0.24rem;
    }

    .item-num {
        /*font-weight: bold;*/
        /*font-size: 0.36rem;*/
        /*color: #F87272;*/
    }
</style>
