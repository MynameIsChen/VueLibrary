import util from '../js/util'

// api地址
let onlineUrl = "https://center.marketing.weiyingjia.cn/";
let testUrl = "http://center.marketingtest.weiyingjia.cn/";
let devUrl = "http://test-center.marketingtest.weiyingjia.cn/";
let localUrl = "http://192.168.6.4:8095/";
//CDN 地址
let onlineCDN = "https://center-marketing-cdn.weiyingjia.cn/";
let testCDN = "http://center-static.weiyingjia.cn/";
// let devCDN = "http://market-static-dev.yunpaas.cn/";
let devCDN = "http://test-center.marketingtest.weiyingjia.cn/";
//初始页面
let localPath = "http://192.168.3.52:8080/";
//切换环境
let apiType = 3; //1:线上;2:测试;3:开发;4:本地;
let indexType = 3; //1:线上;2:测试;3:开发;4:本地;

function getProjectName() {
    return "VueLibrary";
}

//获取API地址
function getApi(type) {
    if (type == 1) {
        return onlineUrl;
    } else if (type == 2) {
        return testUrl;
    } else if (type == 3) {
        return devUrl;
    } else if (type == 4) {
        return localUrl;
    }
}

function getCDN(type) {
    if (type == 1) {
        return onlineCDN;
    } else if (type == 2) {
        return testCDN;
    } else if (type == 3) {
        return devCDN;
    } else if (type == 4) {
        return localPath;
    }
}

function getApiType() {
    return apiType;
}

function getIndexType() {
    return indexType;
}

function getApiPath() {
    return getApi(getApiType());
}

function getMiApiPath() {
    let type = getApiType();
    type = type == 4 ? 3 : type;
    return getApi(type);
}

function getCDNApiPath() {
    let type = getApiType();
    type = type == 4 ? 3 : type;
    return getCDN(type);
}

function getCDNPath() {
    return getCDN(getIndexType());
}

//返回项目根目录
function getHomePath() {
    if (indexType == 4) {
        return localPath;
    } else {
        return getCDNPath() + getProjectName() + "/";
    }
}

function isDebug() {
    return apiType == 4 || indexType == 4;
}

function getUrlData(newShareId) {
    let data = "";
    let campaignId = util.getQueryString("campaignId");
    let channelId = util.getQueryString("channelId");
    let styleId = util.getQueryString("styleId");
    let shareId = util.getQueryString("shareId");
    //添加playerId
    let playerId = util.getQueryString("playerId");

    if (campaignId && channelId) {
        data += ("campaignId=" + campaignId + "&channelId=" + channelId);
        if (styleId) {
            data += ("&styleId=" + styleId);
        }

        if (newShareId) {
            if (playerId) {
                data += ("&playerId=" + playerId);
            }
        } else {
            if (shareId) {
                data += ("&shareId=" + shareId);
            }
            util.setSession("vote2women_playerId", playerId);
        }
    }


    return data;
}

function getIndex(newShareId) {
    let url = getHomePath();
    let data = getUrlData(newShareId);
    if (data) {
        url = url + "?" + data;
    }
    return url;
}

//根据环境获取首页地址
function getShareIndex(shareId) {
    return getIndex(true) + "&shareId=" + shareId;
}

function locationFollow(type) {
    let url = getHomePath();
    let data = getUrlData();
    if (data) {
        url = url + "follow?" + data;
        if (type) {
            url = url + ("&type=" + type);
        }
        util.setSession("followState", true);
        window.location.href = url;
        return;
    }
}

// 一般页面跳转，冲定向是在首页；指定页面需要处理
function locationLogin() {
    let data = getUrlData();
    if (data) {
        util.setSession("homeShareReady", false);
        let url = getMiApiPath() + "mi/loginController/login?" + data + "&fromObject=" + getHomePath() + "?t=" + new Date().getTime();
        window.location.href = url;
        return;
    }
}

//校验关注状态
function locationSubscribe() {
    // /mi/loginController/voteForWomen/checkSubscribe?campaignId=2103&token=11111111111111111111111111&isVoteForWoman=1
    let campaignId = util.getQueryString("campaignId");
    let token = util.getSession("vote2women_token");
    let url = getMiApiPath() + "mi/loginController/voteForWomen/checkSubscribe?campaignId=" + campaignId + "&token=" + token + "&voteForWomenFromUrl=" + getHomePath() + "?t=" + new Date().getTime();
    console.log("locationSubscribe", url);
    window.location.href = url;
    return;
}

//检查登录
function checkLogin() {
    return new Promise((resolve, reject) => {
        let token = util.getQueryString("token");
        console.log("checkLogin",window.location);
        if (token) {
            //这儿说明是用户登录的地方，可以做数据初始化；如：
            util.setSession("vote2women_token", token);
            util.setSession("vote2women_subscribe_state", util.getQueryString("isSubscribe"));
            util.setSession("vote2women_check_key", util.getQueryString("isCheckKey"));
            util.setSession("vote2women_page1_data", "");
            util.setSession("vote2women_page2_data", "");
            util.setSession("vote2women_page5_data", "");
            util.setSession("vote2women_page6_data", "");
            util.setSession("vote2women_page7_data", "");
        }
        let styleId = util.getQueryString("styleId");
        if (util.getSession("vote2women_token") && styleId) {
            let json = {
                time: new Date().getTime()
            };
            let url = getIndex();
            let index = url.indexOf(window.location.origin);
            if (index != -1) {
                history.replaceState(json, "null", url);
                resolve();
            } else {
                window.location.href = url;
                return;
            }
        } else {
            locationLogin();
        }
    })
}

//活动状态（0 删除  1 未发布  2 已发布  3 关闭）
function checkCampaignStatus(layer, status, scanMode) {
    let msg = "";
    if (scanMode == 1) {
        msg = "活动预览中";
    } else {
        if (status == 0) {
            msg = "活动已删除";
        } else if (status == 1) {
            msg = "活动未发布";
        } else if (status == 2) {
            return true;
        } else if (status == 3) {
            msg = "活动关闭";
        }
    }
    layer.msg(msg);
    return false;
}

function checkChargeTime(layer, chargeDate) {
    let dt = util.changeDate(chargeDate);
    if (dt && dt.getTime() - new Date().getTime() >= 0) {
        return true;
    } else {
        layer.msg("已过兑奖期限");
        return false;
    }
}

function getAwardState(et, source, isCharged, st) {
    let state = -1;
    let _st = util.changeDate(st);
    let _et = util.changeDate(et);
    if (!isCharged || isCharged == 0) { //0未兑奖，1已兑奖,2已核销
        if (_et && _et.getTime() - new Date().getTime() < 0) {
            state = 5; //已过期
        } else if (_st && _st.getTime() - new Date().getTime() > 0) {
            state = 0; //未开始
        } else {
            if (source == 1) { //1自家奖品，2平台奖品
                state = 1; //未核销
            } else if (source == 2) {
                state = 2; //未兑奖
            }
        }
    } else {
        if (source == 1) { //1自家奖品，2平台奖品
            state = 3; //已核销
        } else if (source == 2) {
            state = 4; //已兑奖
        }
    }
    return state;
}

function getAwardBg(et, source, isCharged) {
    let classes = ["", "no-verify", "no-state", "ok-verify", "ok-state", "state-invalid"];
    let state = getAwardState(et, source, isCharged);
    let clsName = "";
    if (state > -1 && classes.length > state) {
        clsName = classes[state];
    }
    return clsName;
}

function getAwardTxt(et, source, isCharged, st) {
    let txts = ["未到兑奖时间", "未核销", "未兑奖", "已核销", "已兑奖", "已过期"];
    let state = getAwardState(et, source, isCharged, st);
    let txt = "";
    if (state > -1 && txts.length > state) {
        txt = txts[state];
    }
    return txt;
}

/**
 * name:页面名称；playerId：选手id；isRe：是否replace方式
 */
function toPage(vm, name, playerId, isRe) {
    let shareId = util.getQueryString("shareId");
    let channelId = util.getQueryString("channelId");
    let campaignId = util.getQueryString("campaignId");
    let styleId = util.getQueryString("styleId");
    let obj = {};
    if (channelId && campaignId && styleId) {
        obj = {
            channelId: channelId,
            campaignId: campaignId,
            styleId: styleId,
        };
    }
    if (playerId) {
        obj.playerId = playerId;
    }
    if (shareId) {
        obj.shareId = shareId;
    }
    let routerData = {
        path: '/' + name,
        query: obj
    };

    if (isRe) {
        vm.$router.replace(routerData);
    } else {
        vm.$router.push(routerData);
    }
}

export default {
    getProjectName,
    getApiType,
    getApiPath,
    getMiApiPath,
    getCDNApiPath,
    getCDNPath,
    getHomePath,
    getIndex,
    isDebug,
    getUrlData,
    getShareIndex,
    locationFollow,
    checkLogin,
    checkCampaignStatus,
    locationLogin,
    locationSubscribe,
    checkChargeTime,
    getAwardState,
    getAwardBg,
    getAwardTxt,
    toPage
}
