import app from './app'

//获取地址中对应的键值
function getQueryString(name) {
    if (window.location.search) {
        return getQueryStringFromSearch(name);
    } else {
        return getQueryStringFromHref(name);
    }
}

function getQueryStringFromSearch(name) {
    var reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

function getQueryStringFromHref(paramName) {
    var arr = window.location.href.toString().split("?");
    if (arr && arr.length > 1) {
        var paramArr = arr[1].split("&");
        if (paramArr) {
            for (var i = 0; i < paramArr.length; i++) {
                var valueArr = paramArr[i].split("=");
                if (valueArr && valueArr[0] == paramName) {
                    return valueArr[1];
                }
            }
        }
    }
    return "";
}

//获取cookie的值
function getCookieByName(name) {
    var cookieList = document.cookie.split(";");
    for (var i = 0; i < cookieList.length; i++) {
        var cookieItem = cookieList[i].split("=");
        if (cookieItem && cookieItem[0] == name) {
            return unescape(cookieItem[1]);
        }
    }
    return null;
}

// 高度调整
function resizeHeight() {
    var cH = document.body.clientHeight;
    var cW = document.body.clientWidth;
    var nH = cW * (1334 / 750); //1334/1624
    return nH > cH ? nH : '100%';
}

//设置cookie
function setCookie(name, value) {
    document.cookie = name + "=" + escape(value) + "; path=/";
}

//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

//未读方法
function urlDelP(url, name) {
    var urlArr = url.split('?');
    if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
        var query = urlArr[1];
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        }
        ;
        delete obj[name];
        var urlte = urlArr[0] + '?' + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        return urlte;
    } else {
        return url;
    }
    ;
}

// 判断是不是移动设备
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

function formatDate(t) {
    var tt = new Date(t);
    var year = tt.getFullYear();
    var month = tt.getMonth() + 1;
    var date = tt.getDate();
    var hour = tt.getHours();
    var minute = tt.getMinutes();
    // var second = tt.getSeconds();
    return year + "-" + pre0(month) + "-" + pre0(date) + " " + pre0(hour) + ":" + pre0(minute);
}

function formatDateYMD(t, per) {
    var tt = new Date(t);
    var year = tt.getFullYear();
    var month = tt.getMonth() + 1;
    var date = tt.getDate();
    // var hour = tt.getHours();
    // var minute = tt.getMinutes();
    // var second = tt.getSeconds();
    return year + (per ? per : "/") + pre0(month) + (per ? per : "/") + pre0(date);
}

/**
 * 格林威治时间转换
 */

function changeDate(time) {
    if (!time) return null;
    var date = time.substring(0, 10); //年月日
    var hours = time.substring(11, 13);
    var minutes = time.substring(14, 16);
    var seconds = time.substring(17, 19);
    var timeFlag = date + ' ' + hours + ':' + minutes + ':' + seconds;
    timeFlag = timeFlag.replace(/-/g, "/");
    return new Date(timeFlag);
}

function timeChange(time, per, showDate, add) {
    let timeFlag = changeDate(time);
    if (!timeFlag) return null;
    //时区调整：加8个小时
    if (add) {
        timeFlag = new Date(timeFlag.getTime() + 8 * 3600 * 1000);
    }
    let cMonth = timeFlag.getMonth() + 1;
    let cDay = timeFlag.getDate();
    let cHours = timeFlag.getHours();
    let cMinutes = timeFlag.getMinutes();
    // let cSeconds = timeFlag.getSeconds();
    //+ ' ' + pre0(cHours) + ':' + pre0(cMinutes) + ':' + pre0(cSeconds)
    let result = timeFlag.getFullYear() + (per ? per : '年') + pre0(cMonth) + (per ? per : '月') + pre0(cDay) + "日";
    if (!showDate) {
        result = result + " " + pre0(cHours) + ':' + pre0(cMinutes);
    }
    return result;
}

/**
 * 计算倒计时
 * @param {是否带单位} per
 * @param {时间差} time
 */
function countDown(time, per) {
    let cDay = 0,
        cHour = 0,
        cMinute = 0,
        cSecond = 0; //时间默认值

    if (time > 0) {
        cDay = Math.floor(time / (60 * 60 * 24));
        cHour = Math.floor(time / (60 * 60)) - (cDay * 24);
        cMinute = Math.floor(time / 60) - (cDay * 24 * 60) - (cHour * 60);
        cSecond = Math.floor(time) - (cDay * 24 * 60 * 60) - (cHour * 60 * 60) - (cMinute * 60);
    }

    if (per) {
        return cDay + "天" + pre0(cHour) + "小时" + pre0(cMinute) + "分钟";// + pre0(cSecond) + "秒";
    } else {
        return cDay + "天 " + pre0(cHour) + " : " + pre0(cMinute);// + " : " + pre0(cSecond);
    }
}

/**
 * 计算时间差
 * @param {时间字符串/毫秒} time
 * @param {是否为格林威治时间} isUT
 */
function countTime(time, isUT) {
    if (!time) return 0;
    let d = null;
    if (isUT) {
        d = changeDate(time);
    } else {
        d = new Date(time.replace(/-/g, '/'));
    }
    return (d.getTime() - new Date().getTime()) / 1000;
}

//添加前缀-0
function pre0(num) {
    return num < 10 ? '0' + num : num;
}

// 如果生成的二维码内容包含文字， 需要把字符串转换成UTF - 8
function toUtf8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

// 保存图片：https://ask.dcloud.net.cn/article/807
function saveImg(imgUrl) {
    var blob = new Blob([''], {
        type: 'application/octet-stream'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = imgUrl;
    a.download = imgUrl.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
    URL.revokeObjectURL(url);
}

// 下载图片
function downloadImg(imgUrl, suffix) {
    console.log("downloadImg:", imgUrl, suffix);
    var downLoader = plus.downloader.createDownload(imgUrl, {
        method: 'GET',
        filename: '_downloads/image' + suffix
    }, function (download, status) {
        var fileName = download.filename;
        console.log('文件名:' + fileName);
        console.log('下载状态：' + status);
    });
    downLoader.start();
}

/**
 * 绘制图片
 * @param {*} node 绘制节点
 * @param {*} fileName 保存文件名
 * @param {*} fileType 文件格式
 */
function doCanvas(html2canvas, node, fileName, fileType) {
    return new Promise((resolve, reject) => {
        html2canvas(node, {
            logging: false, //是否打印日志
            taintTest: true, //检测每张图片都已经加载完成
            useCORS: true, //图片跨域相关
            allowTaint: false, //允许跨域
            proxy: "http://jvtd-marketing.oss-cn-hangzhou.aliyuncs.com/",
        }).then(canvas => {
            resolve(canvas);
            // toSave(canvas, fileName, fileType);
            // toSaveBlob(canvas, fileName, fileType);
            // saveAs(canvas, fileName, fileType);
        }).catch(error => {
            reject(error);
        });
    });
}

function doCanvasToBlob(html2canvas, node) {
    return new Promise((resolve, reject) => {
        html2canvas(node, {
            logging: false, //是否打印日志
            useCORS: true,
            taintTest: true, //检测每张图片都已经加载完成
            scale: 4, //增加清晰度
        }).then(function (canvas) {
            resolve(canvas);
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * 保存图片
 * @param {*} canvas canvas资源
 * @param {*} fileName 保存文件名
 * @param {*} fileType 文件格式
 */
function toSave(canvas, fileName, fileType) {
    //第一种
    let imgData = canvas.toDataURL(fileType);
    imgData = imgData.replace(_fixType(fileType), 'image/octet-stream');
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = imgData;
    link.download = fileName + "." + fileType;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 拼接-预览
    // document.body.appendChild(canvas);

    //第二种：需要配合canvas2image.js
    // var canvasWidth = canvas.width;
    // var canvasHeight = canvas.height;
    // var img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight);
    // let w = canvasWidth;
    // let h = canvasHeight;
    // let type = '.'+fileType;
    // let f = 'test';
    // Canvas2Image.saveAsImage(canvas, w, h, type, f);
}

function getCanvasData(canvas, fileType) {
    let imgData = canvas.toDataURL(fileType);
    imgData = imgData.replace(_fixType(fileType), 'image/octet-stream');
    return imgData;
}

function getCanvasDataByBlob(imgSrc) {
    return URL.createObjectURL(base64ToBlob(imgSrc));
}

//base64转blob
function base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
        type: contentType
    });
}

function toSaveBlob(canvas, fileName, fileType) {
    let imgData = URL.createObjectURL(this.getBlob(canvas.toDataURL()))
    //下载海报图片
    var alink = document.createElement("a");
    alink.href = imgData;
    alink.download = fileName + "." + fileType; //图片名
    alink.click();
}

function saveAs(canvas, fileName, fileType) {
    let imgData = canvas.toDataURL(fileType);
    imgData = imgData.replace(_fixType(fileType), 'image/octet-stream');
    alert(imgData);
    var a = document.createElement('a');
    a.href = imgData;
    a.download = fileName + "." + fileType;
    // var event = document.createEvent('MouseEvents');
    // event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    var event = document.createEvent("HTMLEvents");
    event.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错
    a.dispatchEvent(event);
}

/**
 * canvas前检查图片类型
 * @param {*} type 图片类型
 */
function _fixType(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    let r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
}

/**
 * 拷贝到剪贴板
 * @param {*} data 拷贝的内容
 */
function copyContent(data) {
    let inputEl = document.createElement('input');
    inputEl.value = data;
    document.body.appendChild(inputEl);
    inputEl.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    inputEl.className = 'inputEl';
    inputEl.style.display = 'none';
    document.body.removeChild(inputEl);
}

//https://github.com/zenorocha/clipboard.js
function copyToClipboard(ClipboardJS, layer, elementName) {
    let clipboard = new ClipboardJS(elementName);
    clipboard.on('success', function (e) {
        console.info('clipboard-success:', e);
        e.clearSelection();
        layer.msg("复制成功");
        clipboard.destroy();
    });
    clipboard.on('error', function (e) {
        console.error('clipboard-error:', e);
        layer.msg("复制失败");
        clipboard.destroy();
    });
}

function getLength1(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0,
        len = str.length,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
            realLength += 1;
        else
            realLength += 2;
    }
    return realLength;
};

function getLength2(str) {
    var l = str.length;
    var blen = 0;
    for (var i = 0; i < l; i++) {
        if ((str.charCodeAt(i) & 0xff00) != 0) {
            blen++;
        }
        blen++;
    }
    return blen;
}

function getLength3(str) {
    let s = str;
    return s.replace(/[\u0391-\uFFE5]/g, "aa").length; //先把中文替换成两个字节的英文，在计算长度
}

// https: //www.cnblogs.com/richard1015/p/8477869.html
function wxRefresh() {
    var replaceQueryParam = (param, newval, search) => {
        var regex = new RegExp('([?;&])' + param + '[^&;]*[;&]?');
        var query = search.replace(regex, '$1').replace(/&$/, '');

        return (query.length > 2 ? query + '&' : '?') + (newval ? param + '=' + newval : '');
    };

    window.location.replace(location.protocol +
        '//' +
        location.host +
        location.pathname +
        replaceQueryParam('t', new Date().getTime(), location.search) +
        location.hash);
}

function testRandomId() {
    let ids = [];
    ids[0] = Math.random(); //0.5834165740043102
    ids[1] = Date.now(); //时间戳是1482645606622
    //toString(n);数字N进制;可以设计为16(159349090de MongDB中的ObjectID就是24位16进制数)或者36进制(使用字符是0-9a-z)
    //substr(3):去掉“0.”
    ids[2] = Math.random().toString(36).substr(3);
    ids[3] = Date.now().toString(36);
    ids[4] = ids[3] + ids[2];
    let n = 3; //加入随机数长度控制
    ids[5] = ids[3] + Math.random().toString(36).substr(3, n);
    let a = Math.random().toString().substr(3, n);
    console.log("a1", a);
    a = a + Date.now();
    console.log("a2", a);
    console.log("a3", Number(a));
    ids[6] = Number(a).toString(36);

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        console.log("id" + i, id);
    }
}

function getIndexName() {
    let arr = location.pathname.split('/');
    let name = null;
    if (arr) {
        let value = arr[arr.length - 1];
        if (value) {
            let arr1 = value.split(".");
            if (arr1 && arr1.length > 1) {
                name = arr1[0];
            }
        }
    }
    return name;
}

//控制随机长度
function getRandomId(randomLength) {
    return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36);
}

function remToPx(value) {
    var clientWidth = document.documentElement.clientWidth;
    if (!clientWidth) return 0;
    if (clientWidth >= 750) {
        return value * 100;
    } else {
        return value * 100 * (clientWidth / 750);
    }
}

//自动播放：方法一
function autoPlayMusic1(id) {
    let audio = document.getElementById(id);
    let play = function () {
        audio.play();
        document.removeEventListener("touchstart", play, false);
    }
    audio.play();
    document.addEventListener("WeixinJSBridgeReady", function () {
        play();
    }, false);
    document.addEventListener("YixinJSBridgeReady", function () {
        play();
    }, false);
    document.addEventListener("touchstart", play, false);
}

//自动播放：方法二
function autoPlayMusic2(id) {
    let audio = document.getElementById(id);
    if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
            audio.play();
        }, false);
    } else {
        document.addEventListener("WeixinJSBridgeReady", function () {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                audio.play();
            });
        }, false);
    }
    audio.play();
}

//自动播放：方法三
function autoPlayMusic(id) {
    // 可以自动播放时正确的事件顺序是=>loadstart=>loadedmetadata=>loadeddata=>canplay=>play=>playing
    var audioEl = document.getElementById(id);
    let forceSafariPlayAudio = function () {
        if (audioEl) {
            audioEl.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
            audioEl.play(); // iOS 7/8 仅需要 play 一下
        }
    }

    // 由于 iOS Safari 限制不允许 audio autoplay, 必须用户主动交互(例如 click)后才能播放 audio,
    // 因此我们通过一个用户交互事件来主动 play 一下 audio.
    window.addEventListener('touchstart', forceSafariPlayAudio, false);

    // 不能自动播放时触发的事件是
    // iPhone5  iOS 7.0.6 loadstart
    // iPhone6s iOS 9.1   loadstart -> loadedmetadata -> loadeddata -> canplay
    //addEventListener:["loadstart","loadeddata","loadedmetadata","canplay","play","playing","pause"],"touchstart"
    if (audioEl) {
        audioEl.addEventListener('play', function () {
            // 当 audio 能够播放后, 移除这个事件
            window.removeEventListener('touchstart', forceSafariPlayAudio, false);
        }, false);
    }
}

//判断本地缓存值得有效性
function isValid(value) {
    return value !== null && value !== undefined && value !== "" && (typeof value !== Array || value.length > 0);
}

//获取当前网页的html名称
function getPageName() {
    let arr = window.location.pathname.split("/");
    if (arr && arr.length > 0) {
        let name = arr[arr.length - 1];
        let index = name.indexOf(".");
        let value = name.substring(0, index);
        return value;
    }
    return "";
}

//规范数字表现；
function convertNum(num) {
    let info = "0";
    if (num && num > 0) {
        if (num < 10000) {
            info = num;
        } else if (num >= 10000 && num < 1000000) {
            num = num / 10000;
            info = num.toFixed(1) + "万";
        } else if (num >= 1000000 && num < 100000000) {
            num = num / 10000;
            info = Math.floor(num) + "万";
        } else {
            num = num / 100000000;
            info = Math.floor(num) + "亿";
        }
    }
    return info;
}

function isWx() {
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent.match(/MicroMessenger/i) == "micromessenger";
}

function checkUserAgent() {
    return new Promise((resolve, reject) => {
        if (isWx()) {
            resolve();
        } else {
            toErrorAboutWx();
            reject();
        }
    })
}

function toErrorAboutWx() {
    window.location.href = app.getApiPath() + "enrollqd/error.html?msg=%E8%AF%B7%E5%9C%A8%E5%BE%AE%E4%BF%A1%E7%AB%AF%E6%89%93%E5%BC%80";
    return;
}

// 取得XXX到底部的高度
function getScrollTop(el, isBody) {
    var scrollTop = 0;
    console.log("getScrollTop", el.scrollTop);
    if (isBody && document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (el) {
        scrollTop = el.scrollTop;
    }
    return scrollTop;
}

//取页面可视区域高度
function getClientHeight(el, isBody) {
    var clientHeight = 0;
    console.log("getClientHeight", el.clientHeight);
    if (isBody) {
        if (el.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(el.clientHeight, document.documentElement.clientHeight);
        } else {
            clientHeight = Math.max(el.clientHeight, document.documentElement.clientHeight);
        }
    } else {
        clientHeight = el.clientHeight;
    }

    return clientHeight;
};

//取文档整体高度
function getScrollHeight(el, isBody) {
    console.log("getScrollHeight", el.scrollHeight);
    if (isBody) {
        return Math.max(el.scrollHeight, document.documentElement.scrollHeight);
    } else {
        return el.scrollHeight;
    }
};

function onSroll() {
    window.onscroll = function () {
        let el = document.body;
        if (getScrollTop(el, true) + getClientHeight(el, true) == getScrollHeight(el, true)) {
            console.log("滚到底部了");
        }
    }
}

function setSession(key, value) {
    if (key) {
        if (value == null || value == undefined) {
            value = "";
        }
        let type = typeof value;
        if (type == "array" || type == "object") {
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }
}

function getSession(key) {
    let value = null;
    if (key) {
        let temp = sessionStorage.getItem(key);
        try {
            value = JSON.parse(temp);
        } catch (error) {
            // console.log("getSession", error);
            value = temp;
        }
    }
    return value;
}

export default {
    getQueryString,
    getCookieByName,
    resizeHeight,
    setCookie,
    getCookie,
    urlDelP,
    isMobile,
    formatDate,
    formatDateYMD,
    changeDate,
    timeChange,
    countDown,
    countTime,
    toUtf8,
    saveImg,
    downloadImg,
    doCanvas,
    doCanvasToBlob,
    toSave,
    getCanvasData,
    getCanvasDataByBlob,
    base64ToBlob,
    toSaveBlob,
    saveAs,
    copyContent,
    copyToClipboard,
    getLength1,
    getLength2,
    getLength3,
    wxRefresh,
    getIndexName,
    getRandomId,
    remToPx,
    autoPlayMusic1,
    autoPlayMusic2,
    autoPlayMusic,
    isValid,
    getPageName,
    convertNum,
    isWx,
    checkUserAgent,
    toErrorAboutWx,
    getScrollTop,
    getClientHeight,
    getScrollHeight,
    onSroll,
    setSession,
    getSession
}
