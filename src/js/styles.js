// 样式构建
//背景样式
function getBgStyle(bg, h) {
    return {
        backgroundImage: 'url(' + bg + ')',
        position: 'relative',
        backgroundSize: '100% 100%',
        width: '100%',
        overflow: 'scroll',
        height: !h || h == '100%' ? '100%' : (h + 'px'),
        margin: '0 auto',
    }
}

// 元素区及数据的样式
function getItemStyle(item, isRect) {
    // 背景
    let bg = '';
    let value = '';
    if (isRect) {
        bg = item.dataType !== 'text' && item.dataType !== 'date' && item.dataType !== 'input' ? 'url(' + item.itemDefaultValue + ')' : '';
    } else {
        bg = item.itemType !== 'text' && item.itemType !== 'date' && item.itemType !== 'input' ? 'url(' + item.itemContent + ')' : '';
    }
    let style = {
        backgroundImage: bg,
        backgroundSize: '100% 100%',
        width: !item.itemWidth || item.itemWidth == '100%' ? '100%' : item.itemWidth / 50 + 'rem',
        height: !item.itemHeight || item.itemHeight == '100%' ? '100%' : item.itemHeight / 50 + 'rem',
        position: item.position ? item.position : 'absolute',
        left: item.startLeft ? item.startLeft / 50 + 'rem' : 0,
        top: item.startTop ? item.startTop / 50 + 'rem' : 0,
        zIndex: item.itemIndex ? item.itemIndex : 0,
        value: value,
    }

    // contentType
    if (item.contentType) {
        style.backgroundColor = item.contentType.backgroundColor ? item.contentType.backgroundColor : 'transparent';
        style.color = item.contentType.color;
        style.fontSize = item.contentType.fontSize ? item.contentType.fontSize / 50 + 'rem' : '0.12rem';
        style.lineHeight = item.contentType.lineHeight ? item.contentType.lineHeight / 50 + 'rem' : '';
        style.fontWeight = item.contentType.fontWeight;
        style.textAlign = item.contentType.textAlign ? item.contentType.textAlign : 'left';
        style.borderStyle = item.contentType.borderStyle ? item.contentType.borderStyle : '';
        style.borderWidth = item.contentType.borderWidth ? item.contentType.borderWidth / 50 + 'rem' : '';
        style.borderColor = item.contentType.borderColor ? item.contentType.borderColor : '';
        style.borderRadius = item.contentType.borderRadius ? item.contentType.borderRadius / 50 + 'rem' : '';
        style.paddingLeft = item.contentType.paddingLeft ? item.contentType.paddingLeft / 50 + 'rem' : '';
        style.boxSizing = item.contentType.boxSizing;
        style.textDecoration = item.contentType.textDecoration;
    }

    return style;
}

function getMainStyle() {
    return {
        themeColor: {},
        banner: [],//仅配置宽高，数量1-3张
        bannerHeight: 0,
        //倒计时样式固定；报名人数及累计投票可修改字体大小和颜色
        joinTitle: {},
        joinText: {},
        voteTitle: {},
        voteText: {},
        //搜索样式固定
        //列表标题：两种状态的字体大小和颜色可变；
        //选手区域背景(白色)可替换(纯色)；选手item背景、序号背景大小位置不可动(可换图片)；投票按钮：图片，大小位置不变；名字和票数可修改字体大小和颜色；
        listBgColor: {},
        listTitle: [],
        music: [{
            left: 0,
            top: 0,
            backgroundImage: null
        },
            {
                left: 0,
                top: 0,
                backgroundImage: null
            }],//大小不变，位置和音乐可变,两种状态
        floatBg: [],//只换图标,大小位置不变
        menu: [[], [], [], []]//只换图标
    };
}

function getPlayerItemStyle() {
    return {
        item: {},
        itemTag: {
            color: "#ffffff",
            fontSize: "0.24rem",
            backgroundImage: null
        },
        itemIcon: {},
        itemNick: {},
        itemNum: {},
        itemBtn: {},
        itemBtnVote: {}
    }
}

function getHomeStyle(homeItemList, homeDataRect) {
    let mainStyle = getMainStyle();
    let playerItemStyle = getPlayerItemStyle();
    let bannerIndex = 0;

    $.map(homeItemList, (a) => {
        if (a && a.contentType) {
            a.contentType = eval('(' + a.contentType + ')');
        }

        let itemStyle = getItemStyle(a);
        if (a.itemName == "page1_theme") {
            mainStyle.themeColor = {
                backgroundColor: itemStyle.backgroundColor
            };
        } else if (a.itemName == "page1_banner") {
            mainStyle.bannerHeight = itemStyle.height;
        } else if (a.itemName == "page1_list") {
            mainStyle.listBgColor = {
                backgroundColor: itemStyle.backgroundColor
            }
        } else if (a.itemName == "page1_music") {
            mainStyle.music[0].left = mainStyle.music[1].left = itemStyle.left;
            mainStyle.music[0].top = mainStyle.music[1].top = itemStyle.top;
        }


        if (a.subItemList) {
            $.map(a.subItemList, (b) => {
                if (b && b.contentType) {
                    b.contentType = eval('(' + b.contentType + ')');
                }
                let subItemStyle = getItemStyle(b);
                if (b.itemName == "page1_vote_join") {//报名人数title样式
                    mainStyle.joinTitle = {
                        color: subItemStyle.color,
                        fontSize: subItemStyle.fontSize,
                        fontWeight: subItemStyle.fontWeight
                    };
                } else if (b.itemName == "page1_vote_vote") {//累计投票title样式
                    mainStyle.voteTitle = {
                        color: subItemStyle.color,
                        fontSize: subItemStyle.fontSize,
                        fontWeight: subItemStyle.fontWeight
                    };
                } else if (b.itemName == "page1_list_title_select") {//累计投票title样式
                    mainStyle.listTitle[0] = {
                        color: subItemStyle.color,
                        fontSize: subItemStyle.fontSize,
                        fontWeight: subItemStyle.fontWeight,
                        borderBottom: "0.01rem " + subItemStyle.color + " solid"
                    };
                } else if (b.itemName == "page1_list_title_normal") {//累计投票title样式
                    mainStyle.listTitle[1] = {
                        color: subItemStyle.color,
                        fontSize: subItemStyle.fontSize,
                        fontWeight: subItemStyle.fontWeight,
                        border: "none"
                    };
                } else if (b.itemName == "page1_list_item_bg") {//item背景
                    playerItemStyle.item = {
                        width: subItemStyle.width,
                        height: subItemStyle.height,
                        backgroundImage: subItemStyle.backgroundImage
                    };
                } else if (b.itemName == "page1_list_item_tag") {//item-tag
                    playerItemStyle.itemTag.backgroundImage = subItemStyle.backgroundImage;
                } else if (b.itemName == "page1_list_item_cover") {//item图片
                    playerItemStyle.itemIcon = {
                        width: subItemStyle.width,
                        height: subItemStyle.height
                    };
                } else if (b.itemName == "page1_list_item_vote") {//item投票
                    playerItemStyle.itemBtn = {
                        width: subItemStyle.width,
                        height: subItemStyle.height,
                        backgroundImage: subItemStyle.backgroundImage
                    };
                } else if (b.itemName == "page1_list_item_voted") {//item已投票
                    playerItemStyle.itemBtnVote = {
                        width: subItemStyle.width,
                        height: subItemStyle.height,
                        backgroundImage: subItemStyle.backgroundImage
                    };
                }
            })
        }
    });

    $.map(homeDataRect, (a) => {
        $.map(a, (b) => {
            if (b) {
                if (b.contentType) {
                    b.contentType = eval('(' + b.contentType + ')');
                }

                let rectStyle = getItemStyle(b, true);
                if (b.itemName == "page1_banner" && b.itemDefaultValue) {
                    mainStyle.banner[bannerIndex] = b.itemDefaultValue;
                    bannerIndex++;
                } else if (b.dataItemName == "page1_vote_join_text") { //报名人数字体样式
                    mainStyle.joinText = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight
                    };
                } else if (b.dataItemName == "page1_vote_vote_text") { //累计投票字体样式
                    mainStyle.voteText = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight
                    };
                } else if (b.dataItemName == "page1_list_item_nick_text") {
                    playerItemStyle.itemNick = {
                        color: rectStyle.color,
                    };
                } else if (b.dataItemName == "page1_list_item_num_text") {
                    playerItemStyle.itemNum = {
                        color: rectStyle.color,
                    };
                } else if (b.dataItemName == "page1_list_item_tag_text") {
                    playerItemStyle.itemTag.color = rectStyle.color;
                    playerItemStyle.itemTag.fontSize = rectStyle.fontSize;
                } else if (b.dataItemName == "page1_music_on") {
                    mainStyle.music[1].backgroundImage = rectStyle.backgroundImage;
                } else if (b.dataItemName == "page1_music_off") {
                    mainStyle.music[0].backgroundImage = rectStyle.backgroundImage;
                } else if (b.dataItemName == "page1_float_join") {
                    mainStyle.floatBg[0] = {
                        backgroundImage: rectStyle.backgroundImage
                    };
                } else if (b.dataItemName == "page1_float_mine") {
                    mainStyle.floatBg[1] = {
                        backgroundImage: rectStyle.backgroundImage
                    };
                } else if (b.dataItemName == "page1_menu_main_no") {
                    mainStyle.menu[0][0] = b.itemDefaultValue;
                } else if (b.dataItemName == "page1_menu_main_ok") {
                    mainStyle.menu[0][1] = b.itemDefaultValue;
                } else if (b.dataItemName == "page1_menu_rank_no") {
                    mainStyle.menu[1][0] = b.itemDefaultValue;
                } else if (b.dataItemName == "page1_menu_rank_ok") {
                    mainStyle.menu[1][1] = b.itemDefaultValue;
                } else if (b.dataItemName == "page1_menu_desc_no") {
                    mainStyle.menu[2][0] = b.itemDefaultValue;
                } else if (b.dataItemName == "page1_menu_desc_ok") {
                    mainStyle.menu[2][1] = b.itemDefaultValue;
                } else if (b.dataItemName == "page1_menu_us_no") {
                    mainStyle.menu[3][0] = b.itemDefaultValue;
                } else if (b.dataItemName == "page1_menu_us_ok") {
                    mainStyle.menu[3][1] = b.itemDefaultValue;
                }
            }
        })
    });

    return {
        mainStyle,
        playerItemStyle,
    }
}

function getRankStyle(itemList, dataRect) {
    let headStyle = {};
    let rankItemStyle = {
        rankOrder: [],
        rankAvatar: {},
        rankNick: {},
        rankNum: {}
    };

    $.map(itemList, (a) => {
        if (a && a.contentType) {
            a.contentType = eval('(' + a.contentType + ')');
        }

        let itemStyle = getItemStyle(a);
        if (a.itemName == "page2_head") {
            headStyle = {
                width: itemStyle.width,
                height: itemStyle.height,
                backgroundImage: itemStyle.backgroundImage
            };
        }

        if (a.subItemList) {
            $.map(a.subItemList, (b) => {
                if (b && b.contentType) {
                    b.contentType = eval('(' + b.contentType + ')');
                }
                let subItemStyle = getItemStyle(b);
                if (b.itemName == "page2_item") {
                    //可配置宽高
                }
            })
        }
    });

    $.map(dataRect, (a) => {
        $.map(a, (b) => {
            if (b) {
                if (b.contentType) {
                    b.contentType = eval('(' + b.contentType + ')');
                }

                let rectStyle = getItemStyle(b, true);
                if (b.dataItemName == "page2_item_avatar") {
                    rankItemStyle.rankAvatar = {
                        width: rectStyle.width,
                        height: rectStyle.height,
                        borderRadius: rectStyle.width
                    };
                } else if (b.dataItemName == "page2_item_nick") {
                    rankItemStyle.rankNick = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight,
                    };
                } else if (b.dataItemName == "page2_item_num") {
                    rankItemStyle.rankNum = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight,
                    };
                } else if (b.dataItemName == "page2_item_order_first") {
                    rankItemStyle.rankOrder[1] = {
                        width: rectStyle.width,
                        height: rectStyle.height,
                        backgroundImage: rectStyle.backgroundImage,
                    };
                } else if (b.dataItemName == "page2_item_order_second") {
                    rankItemStyle.rankOrder[2] = {
                        width: rectStyle.width,
                        height: rectStyle.height,
                        backgroundImage: rectStyle.backgroundImage,
                    };
                } else if (b.dataItemName == "page2_item_order_third") {
                    rankItemStyle.rankOrder[3] = {
                        width: rectStyle.width,
                        height: rectStyle.height,
                        backgroundImage: rectStyle.backgroundImage,
                    };
                } else if (b.dataItemName == "page2_item_order_text") {
                    rankItemStyle.rankOrder[0] = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight,
                    };
                }
            }
        })
    });

    return {
        headStyle,
        rankItemStyle
    }
}

function getPlayerStyle(itemList, dataRect) {
    let playerStyle = {
        btnVote: {},
        btnBack: {},
        avatar: {},
        nick: {},
        num: {},
        order: {},
        desc: {},
    };

    $.map(itemList, (a) => {
        if (a && a.contentType) {
            a.contentType = eval('(' + a.contentType + ')');
        }

        let itemStyle = getItemStyle(a);
        if (a.itemName == "page6_vote") {//投TA一票
            playerStyle.btnVote = {
                width: itemStyle.width,
                height: itemStyle.height,
                backgroundImage: itemStyle.backgroundImage
            };
        } else if (a.itemName == "page6_back_home") {//返回首页
            playerStyle.btnBack = {
                width: itemStyle.width,
                height: itemStyle.height,
                backgroundImage: itemStyle.backgroundImage
            };
        }
    });

    $.map(dataRect, (a) => {
        $.map(a, (b) => {
            if (b) {
                if (b.contentType) {
                    b.contentType = eval('(' + b.contentType + ')');
                }

                let rectStyle = getItemStyle(b, true);
                if (b.dataItemName == "page6_content_avatar") {
                    playerStyle.avatar = {
                        width: rectStyle.width,
                        height: rectStyle.height,
                        borderRadius: rectStyle.borderRadius
                    };
                } else if (b.dataItemName == "page6_content_desc") {
                    playerStyle.desc = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight
                    };
                } else if (b.dataItemName == "page6_content_nick") {
                    playerStyle.nick = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight
                    };
                } else if (b.dataItemName == "page6_content_num") {
                    playerStyle.num = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight
                    };
                } else if (b.dataItemName == "page6_content_order") {
                    playerStyle.order = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight
                    };
                }
            }
        })
    });

    return playerStyle;
}

function getShareStyle(itemList, dataRect) {
    let shareStyle = {
        bg: {},
        btnInvite: {},
        cover: {},
        desc: {},
    };

    $.map(itemList, (a) => {
        if (a && a.contentType) {
            a.contentType = eval('(' + a.contentType + ')');
        }

        let itemStyle = getItemStyle(a);
        if (a.itemName == "page7_info") {//背景
            shareStyle.bg = {
                width: itemStyle.width,
                backgroundColor: itemStyle.backgroundColor
            };
        } else if (a.itemName == "page7_info_invite") {//邀请
            shareStyle.btnInvite = {
                width: itemStyle.width,
                height: itemStyle.height,
                backgroundImage: itemStyle.backgroundImage
            };
        }
    });

    $.map(dataRect, (a) => {
        $.map(a, (b) => {
            if (b) {
                if (b.contentType) {
                    b.contentType = eval('(' + b.contentType + ')');
                }

                let rectStyle = getItemStyle(b, true);
                if (b.dataItemName == "page7_info_desc") {
                    shareStyle.desc = {
                        color: rectStyle.color,
                        fontSize: rectStyle.fontSize,
                        fontWeight: rectStyle.fontWeight
                    };
                } else if (b.dataItemName == "page7_info_cover") {
                    shareStyle.cover = {
                        width: rectStyle.width,
                        height: rectStyle.height,
                        backgroundImage: rectStyle.backgroundImage
                    };
                }
            }
        })
    });

    return shareStyle;
}

function getEnrollStyle(itemList, dataRect) {
    let enrollStyle = {
        btnSubmit: {},
        btnBack: {},
    };

    $.map(itemList, (a) => {
        if (a && a.contentType) {
            a.contentType = eval('(' + a.contentType + ')');
        }

        let itemStyle = getItemStyle(a);
        if (a.itemName == "page5_submit") {//确认提交
            enrollStyle.btnSubmit = {
                width: itemStyle.width,
                height: itemStyle.height,
                backgroundImage: itemStyle.backgroundImage
            };
        } else if (a.itemName == "page5_tohome") {//返回首页
            enrollStyle.btnBack = {
                width: itemStyle.width,
                height: itemStyle.height,
                backgroundImage: itemStyle.backgroundImage
            };
        }
    });

    return enrollStyle;
}

export default {
    getHomeStyle,
    getRankStyle,
    getPlayerStyle,
    getShareStyle,
    getEnrollStyle
}
