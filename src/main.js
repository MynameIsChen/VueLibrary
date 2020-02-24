import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import layer from 'vue-layer'
import html2canvas from 'html2canvas'
import clipboard from 'clipboard'
import shake from 'shake.js' //es6方式导入

import './js/jquery-2.1.0'
import './js/common'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-layer/lib/vue-layer.css'
import './style/dialog.css'
import './style/reset.css'

// 加载插件
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$html2canvas = html2canvas
Vue.prototype.$clipboard = clipboard
Vue.prototype.$layer = layer(Vue)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')