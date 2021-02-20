import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局样式
import './styles/index.scss'

// element3 TODO element3-还不完善
// import element3 from "plugins/element3";
import elementPlus from "plugins/elementPlus";


createApp(App).use(elementPlus).use(router).use(store).mount('#app');
