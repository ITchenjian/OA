// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import 'element-ui/lib/theme-default/index.css';

import layer from 'vue-layer';

import url from './url.js';

Vue.use(ElementUI);

Vue.use(url);

Vue.prototype.$layer = layer(Vue, {
    msgtime: 3
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

