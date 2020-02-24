<template>
    <div class="info-content">
        <div class="info-desc-list">
            <div class="item-info" v-for="item in campaignInfoList" v-if="item && item.content">
                <div class="item-info-title">{{item.title}}</div>
                <div class="item-info-content">{{item.content}}
                    <div class="item-info-icon" v-if="item.icon" :style="item.icon"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '../js/http'
    import util from '../js/util'

    export default {
        name: "Info",
        data() {
            return {
                campaignInfoList: [], //活动说明数据
                ruleDesc: null,
            }
        },
        created() {
            this.initCampaignInfo();
        },
        mounted() {

        },
        methods: {
            initCampaignInfo() {
                this.campaignInfoList = [
                    {
                        title: "活动简介",
                        content: "活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介活动简介"
                    },
                    {
                        title: "报名时间",
                        content: "2020年02月03日 15:15—2020年02月03日 15:15"
                    },
                    {
                        title: "报名须知",
                        content: "报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知报名须知"
                    },
                    {
                        title: "投票时间",
                        content: "2020年02月03日 15:15—2020年02月03日 15:15"
                    },
                    {
                        title: "主办单位",
                        content: "北京聚通达科技股份有限公司",
                        icon: {}
                    },
                    {
                        title: "投票须知",
                        content: "每人每日可投5票，可自由分配票数投给任意选手"
                    }
                ];
                this.getCompanyConfig();
                this.getCampaignConfig();
            },

            //企业信息
            getCompanyConfig() {
                http._getCompanyConfig().then(data => {
                    if (data.data) {
                        this.campaignInfoList[4].content = data.data.companyName;
                        if (data.data.showLogo != 0) {
                            this.campaignInfoList[4].icon = {
                                backgroundImage: 'url(' + data.data.logoImg + ')'
                            };
                        }
                    }
                })
            },

            // 活动信息
            getCampaignConfig() {
                http._getCampaignConfig().then(data => {
                    if (data.data.code == 200) {
                        let homeData = data.data.data;
                        let campaignConfig = homeData.campaignConfig;
                        let enrollConfig = homeData.enrollConfig;
                        let voteConfig = homeData.voteConfig;
                        if (campaignConfig) {
                            this.campaignInfoList[0].content = campaignConfig.ruleDesc;
                        }
                        if (enrollConfig) {
                            this.campaignInfoList[1].content = util.timeChange(enrollConfig.enrollStartTime) + " - " + util.timeChange(enrollConfig.enrollEndTime);
                            this.campaignInfoList[2].content = enrollConfig.enrollRule;
                        }
                        if (voteConfig) {
                            this.campaignInfoList[3].content = util.timeChange(voteConfig.voteStartTime) + " - " + util.timeChange(voteConfig.voteEndTime);
                            this.campaignInfoList[5].content = voteConfig.voteRule;
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .info-content {
        width: 100%;
        height: 100%;
        background-color: #A66FF1;
        overflow: scroll;
    }

    .info-desc-list {
        width: 7rem;
        margin: 0.5rem 0.25rem 0.25rem;
        padding: 0 0.5rem 0.4rem;
        box-sizing: border-box;
        background-color: #FFFFFF;
        border-radius: 0.05rem;
    }

    .item-info-title {
        width: 2.4rem;
        padding-top: 0.4rem;
        box-sizing: border-box;
        text-align: start;
        font-size: 0.28rem;
        color: #333333;
        font-weight: bold;
    }

    .item-info-content {
        margin-top: 0.2rem;
        padding: 0.2rem 0.25rem;
        box-sizing: border-box;
        background-color: #F2F2F2;
        font-size: 0.22rem;
        color: #999999;
        line-height: 0.36rem;
    }

    .item-info-icon {
        width: 1rem;
        height: 1rem;
        margin-top: 0.2rem;
        background-size: 100% 100%;
    }
</style>
