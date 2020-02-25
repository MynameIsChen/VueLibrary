import util from './util'
import app from './app'
import axios from 'axios'
// import JWeiXin from './js/jweixin-1.4.0'
import wx from 'weixin-js-sdk';

//api请求公共方法
function http(method, url, data, contentType) {
    let token = util.getSession("vote2women_token");
    if (util.isValid(token)) {
        return new Promise((resolve, reject) => {
            axios({
                method: method,
                url: url,
                headers: {
                    "token": token,
                    "campaignId": util.getQueryString("campaignId"),
                    "channelId": util.getQueryString("channelId"),
                    "Content-Type": contentType ? contentType : "application/json",
                },
                data: data,
            }).then(function (data) {
                if (data) {
                    if (data.data && data.data.code == 50004) {
                        util.setSession("vote2women_token", "");
                        app.locationLogin();
                    } else {
                        resolve(data);
                    }
                }
            }).catch(function (error) {
                reject(error);
            })
        })
    } else {
        app.locationLogin();
    }
}

//post
function _post(url, data, contentType) {
    return http("post", url, data, contentType);
}

//http-Get
function _get(url) {
    return http("get", url);
}

//获取活动基础信息
function _getCampaignInfo(vm, refreshStatus) {
    return new Promise((resolve, reject) => {
        _get(app.getMiApiPath() + "mi/loginController/getCampaignInfo?campaignId=" + util.getQueryString("campaignId")).then(data => {
            let campaignName = data.data.campaignName;
            document.title = campaignName;
            util.setSession("vote2women_campaign_title", campaignName);
            if (!refreshStatus) {
                util.setSession("vote2women_share_flag", data.data.shareFlag); //是否开启分享;0:关闭,1:开启
                util.setSession("vote2women_share_title", data.data.shareTitle); //分享标题
                util.setSession("vote2women_share_content", data.data.shareContent); //自定义分享内容
                util.setSession("vote2women_share_content_custom", data.data.shareContentCustom); //内容是否自定义:0默认;1自定义
                util.setSession("vote2women_share_img", data.data.shareImg); //自定义分享图标
                util.setSession("vote2women_share_img_custom", data.data.shareImgCustom); //图标是否自定义:0默认;1自定义
                readyShare(vm);
            }
            resolve(data);
        });
    });
}

//======================================微信分享============================================================================

// 判断当前客户端版本是否支持指定JS接口
// 备注： checkJsApi接口是客户端6 .0 .2 新引入的一个预留接口， 第一期开放的接口均可不使用checkJsApi来检测。
function wxCheckJsApi(vm) {
    return new Promise((resolve, reject) => {
        wx.checkJsApi({
            jsApiList: ["updateAppMessageShareData", "updateTimelineShareData", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareQZone"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                if (res.errMsg == "checkJsApi:ok" && res.checkResult &&
                    res.checkResult.updateAppMessageShareData && res.checkResult.updateTimelineShareData) {
                    //请求接口获取数据
                    resolve(res);
                } else {
                    reject();
                }
            },
            fail: function (e) {
                reject();
            }
        });
    });
}

// 微信分享
function readyShare(vm) {
    let origin = location.href.split('#')[0];
    // 获取域名
    let wxData = {
        curUrl: origin, //项目对应的全路径
        campaignId: util.getQueryString("campaignId"),
        channelId: util.getQueryString("channelId"),
    };
    wxShare(wxData).then(function (data) {
        let o = data.data;
        if (o.code == 200) {
            WeChatShare(vm, o.appId, o.timestamp, o.nonceStr, o.signature);
        } else {
            vm.$layer.msg("信息获取失败，请刷新页面");
        }
    }).catch((e) => {
        console.log("share", e);
        vm.$layer.msg("信息获取失败，请刷新页面");
    });
}

function WeChatShare(vm, appId, timestamp, nonceStr, signature) {
    wx.config({
        debug: app.isDebug(), // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名
        jsApiList: ["updateAppMessageShareData", "updateTimelineShareData", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareQZone", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "hideMenuItems"] // 必填，需要使用的JS接口列表
    });

    wxReadyOld(vm);

    wx.error(function (res) {
        console.log("wxshare-ready-error", res);
        vm.$layer.msg("信息获取失败，请刷新页面");
    });
}

function getShareTitle() {
    let title = util.getSession("vote2women_share_title");
    if (util.isValid(title)) {
        return title;
    } else {
        return util.getSession("vote2women_campaign_title");
    }
}

function getShareContent() {
    let contentCustom = util.getSession("vote2women_share_content_custom");
    let content = util.getSession("vote2women_share_content");
    if (util.isValid(contentCustom) && contentCustom == 1 && util.isValid(content)) {
        let index = content.toString().indexOf("<span>");
        if (index == -1) {
            return content;
        }
        let arr = content.split("<span>");
        if (arr.length > 0) {
            let num = Math.floor(Math.random() * arr.length);
            return arr[num];
        } else {
            return content;
        }
    } else {
        return "轻轻松松就能抽到大奖，积攒多年的人品有用了，你也赶紧来抽奖吧";
    }
}

function getShareImg() {
    let imgCustom = util.getSession("vote2women_share_img_custom");
    let img = util.getSession("vote2women_share_img");
    if (util.isValid(imgCustom) && imgCustom == 1 && util.isValid(img)) {
        return img;
    } else {
        return ""; //getHomePath() + "images/icon.png"
    }
}

function wxReadyNew(vm) {
    let shareId = util.getRandomId(8);
    var shareObj = {
        title: getShareTitle(), // 分享标题
        desc: getShareContent(), // 分享描述
        link: app.getShareIndex(shareId), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        // 该链接是重定向链接，因为需要获取用户code，但是该链接又无法直接写微信获取code的链接，
        // 所以需要点击后重新加载新的页面，来实现重定向，重新打开获取code的微信链接，实现获取用户信息的功能；
        imgUrl: getShareImg(), // 分享图标
        success: function () {
            // 设置成功
        },
        fail: function () {
            //设置失败
        },
    };
    wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
        // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
        wx.updateAppMessageShareData(shareObj);
        //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
        wx.updateTimelineShareData(shareObj);
    });
}

function getShareObj(shareTo) {
    let shareId = util.getRandomId(8);
    var shareObj = {
        title: getShareTitle(), // 分享标题
        desc: getShareContent(), // 分享描述
        link: app.getShareIndex(shareId), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        // 该链接是重定向链接，因为需要获取用户code，但是该链接又无法直接写微信获取code的链接，
        // 所以需要点击后重新加载新的页面，来实现重定向，重新打开获取code的微信链接，实现获取用户信息的功能；
        imgUrl: getShareImg(), // 分享图标
        // type: '', // 分享类型,music、video或link，不填默认为link
        //   dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            //Menu:用户取消分享后执行的回调函数
        },
        fail: function () {
        },
        complete: function () {
            _addShareWithTo(shareId, shareTo).then(data => {
            });
            wxReadyOld(vm);
        }
    };

    return shareObj;
}

const SHARE_WX = 1;
const SHARE_CIRCLE = 2;
const SHARE_QQ = 3;
const SHARE_QZONE = 4;

function wxReadyOld(vm) {
    wx.ready(function () {
        //页面没有准备完成，有下一步操作可执行的情况下，执行下一步
        onNext(vm);
        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
        wx.onMenuShareTimeline(getShareObj(SHARE_CIRCLE));
        //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
        wx.onMenuShareAppMessage(getShareObj(SHARE_WX));
        //获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
        wx.onMenuShareQQ(getShareObj(SHARE_QQ));
        //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口（即将废弃）
        wx.onMenuShareQZone(getShareObj(SHARE_QZONE));
        let shareFlag = util.getSession("vote2women_share_flag")
        if (util.isValid(shareFlag) && shareFlag == 0) {
            //隐藏所有非基础按钮接口
            wx.hideAllNonBaseMenuItem();
        } else {
            //显示所有功能按钮接口
            wx.showAllNonBaseMenuItem();
            wx.hideMenuItems({
                menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        }
    })
}

function onNext(vm) {
    if (vm && vm.shareCompleteNext) {
        vm.shareCompleteNext();
    }
}

//======================================微信分享============================================================================

//微信分享
function wxShare(data) {
    return _post(app.getMiApiPath() + "mi/weChatLoginController/wxShare", data);
}

//styleId:样式id；page：第几页(1.首页;2.活动说明;3.我的奖品;4.奖品详情;5.中奖页面;6.未中奖页面;7.填写信息;8.兑奖页面)
function _getPage(page) {
    return _get(app.getCDNApiPath() + "mi/CDNController/getPage/" + util.getQueryString("styleId") + "/" + page);
}

// 活动详情
// 企业信息:mi/currency/companyConfig/{campaignId}
// 奖品列表:mi/currency/awardConfigs/{campaignId}
function _getCompanyConfig() {
    return _get(app.getMiApiPath() + "mi/currency/companyConfig/" + util.getQueryString("campaignId"));
}

function _getCampaignAwards() {
    return _get(app.getMiApiPath() + "mi/currency/awardConfigs/" + util.getQueryString("campaignId"));
}

//校验秘钥
function _verifyKey(key) {
    return _get(app.getMiApiPath() + "mi/currency/checkKey/" + key);
}

//投诉接口
function _createComplaint(data) {
    return _post(app.getMiApiPath() + "mi/currency/createComplaint/" + util.getQueryString("campaignId"), data);
}

//分享统计
function _addShare(shareId) {
    return _post(app.getMiApiPath() + "mi/currency/addShare/" + util.getQueryString("campaignId") + "/" + shareId);
}

//统计:分享成功:shareType:1微信好友/2微信朋友圈/3QQ/4QQ空间;currency/addShareWithTo?campaignId=1&channelId=1&sharedId=2&shareTo=3
function _addShareWithTo(shareId, shareTo) {
    return _post(app.getMiApiPath() + "mi/currency/addShareWithTo?campaignId=" + util.getQueryString("campaignId") + "&channelId=" + util.getQueryString("channelId") + "&sharedId=" + shareId + "&shareTo=" + shareTo)
}

// ============================================c端接口-sign========================================================
let apiType = app.getApiType();

let path = "voteforwomen/";
if (apiType !== 4) {
    path = "vote2women/" + path;
}

//获取配置信息：vote2women/voteforwomen/campaignConfig/{campaignId}
function _getCampaignConfig() {
    return _get(app.getApiPath() + path + "campaignConfig/" + util.getQueryString("campaignId"));
}

//vote2women/voteforwomen/getFormFormat?campaignId=2129
function _getFormFormat() {
    return _get(app.getApiPath() + path + "getFormFormat?campaignId=" + util.getQueryString("campaignId"));
}

//报名:vote2women/voteforwomen/enroll
function _postEnroll(data) {
    return _post(app.getApiPath() + path + "enroll", data);
}

//报名人数及累计票数:vote2women/voteforwomen/enrollNumAndAllVotes?campaignId=2129
function _getEnrollNum() {
    return _get(app.getApiPath() + path + "enrollNumAndAllVotes?campaignId=" + util.getQueryString("campaignId"));
}

//作品列表:vote2women/voteforwomen/worksList?campaignId=2129&sortRule=2
//排序规则（1表示最新参赛，2表示人气排行，3表示参赛顺序）
function _getWorksList(sortRule, nick) {
    let nickData = nick ? ("&worksName=" + nick) : "";
    return _get(app.getApiPath() + path + "worksList?campaignId=" + util.getQueryString("campaignId") + "&sortRule=" + sortRule + nickData);
}

//投票:vote2women/voteforwomen/vote?campaignId=2129&channelId=1579&worksId=8
function _vote(worksId) {
    return _get(app.getApiPath() + path + "vote?campaignId=" + util.getQueryString("campaignId") + "&channelId=" + util.getQueryString("channelId") + "&worksId=" + worksId);
}

//作品详情:vote2women/voteforwomen/worksDetail?worksId=7
function _getWorksDetail(worksId) {
    return _get(app.getApiPath() + path + "worksDetail?campaignId=" + util.getQueryString("campaignId") + "&worksId=" + worksId);
}

//报名信息:vote2women/voteforwomen/enrollStatus?campaignId=2129
function _getEnrollDetail() {
    return _get(app.getApiPath() + path + "enrollStatus?campaignId=" + util.getQueryString("campaignId"));
}

//排行榜:vote2women/voteforwomen/rankingList?campaignId=2129
function _getRankList() {
    return _get(app.getApiPath() + path + "rankingList?campaignId=" + util.getQueryString("campaignId"));
}

//mi/template/uploadImage
function _uploadImg(data) {
    return _post(app.getMiApiPath() + "mi/template/uploadImage" ,data,"multipart/form-data");
}


export default {
    _getCampaignInfo,
    wxCheckJsApi,
    readyShare,
    _getPage,
    _getCompanyConfig,
    _getCampaignAwards,
    _verifyKey,
    _createComplaint,
    _getCampaignConfig,
    _getFormFormat,
    _postEnroll,
    _getEnrollNum,
    _getWorksList,
    _vote,
    _getWorksDetail,
    _getEnrollDetail,
    _getRankList,
    _uploadImg
}
