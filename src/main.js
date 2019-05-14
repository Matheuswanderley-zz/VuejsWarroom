import Vue from 'vue'
import App from './App.vue'
// import Vuex from 'vuex'
import Congress from './plugins/congress-chart/'
import api from './services/api'
import './components/Icons/'

Vue.config.productionTip = false
Vue.use(Congress)

new Vue({
  api,
  render: h => h(App),
}).$mount('#app')
