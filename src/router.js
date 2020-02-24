import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Exchange from './views/Exchange.vue'
import AwardForm from './views/AwardForm.vue'
import Follow from './views/Follow.vue'
import Award from './views/Award.vue'
import FeedBack from './views/FeedBack.vue'
import Enroll from './views/Enroll.vue'
import Player from './views/Player.vue'

import wx from 'weixin-js-sdk'
import util from './js/util'
import app from './js/app'

//路由级别的代码分解,为这个路由生成一个单独的块(home.[hash].js),当访问该路由时，它是惰性加载的。
// component: () => import( /* webpackChunkName: "about" */ './views/Home.vue')
const router = new Router({
    mode: 'history',
    base: '/vote2womenh5/',
    routes: [{
        path: '*',
        name: 'login',
        component: Login
    },
        {
            path: '/home',
            name: 'home',
            component: Home,
        },
        {
            path: '/exchange',
            name: 'exchange',
            component: Exchange
        },
        {
            path: '/awardform',
            name: 'awardform',
            component: AwardForm
        },
        {
            path: '/follow',
            name: 'follow',
            component: Follow
        },
        {
            path: '/award',
            name: 'award',
            component: Award
        }, {
            path: '/feedback',
            name: 'feedback',
            component: FeedBack
        }, {
            path: '/enroll',
            name: 'enroll',
            component: Enroll
        }, {
            path: '/player',
            name: 'player',
            component: Player
        }
    ]
})

Vue.use(Router)
export default router
router.beforeEach((to, from, next) => {
    let isIOS = util.isMobile.iOS();
    let isAndroid = util.isMobile.Android();
    if (from.name == null && to.name == "home") {
        util.setSession("homeShareReady", false);
    }
    let toPath = "/" + app.getProjectName() + to.path;
    let followState = util.getSession("followState");
    if (isAndroid) {
        if (followState) {
            if (to.name != "follow") {
                util.setSession("followState", false);
            }
        } else {
            if (from.path == "/" && to.name != "login" && to.name != "home") {
                next("/home?" + app.getUrlData());
            }
        }
    }

    if (isIOS && toPath != location.pathname) {
        location.assign(app.getCDNPath() + app.getProjectName() + to.fullPath) // 此处不可使用location.replace
    }
    if (from.name == 'home' && to.name == 'login') {
        wx.closeWindow();
    }
    next();
})
