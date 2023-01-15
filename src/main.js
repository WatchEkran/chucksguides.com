import { createApp } from 'vue'
import App from './components/App.vue'
import router from './router'
import common from './common.styl?inline'
import '/src/assets/base.min.css'
import '/src/assets/fancy.min.css'

createApp(App).use(router).mount('#app')
