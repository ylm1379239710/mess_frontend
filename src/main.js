import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import axios from 'axios';
import store from './store/index';
import jsCookie from 'js-cookie'
import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker)
Vue.prototype.$cookie = jsCookie;
Vue.prototype.axios=axios;
Vue.use(ElementUI);
Vue.use(router);
Vue.use(store)
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
