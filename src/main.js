import { createApp } from 'vue'
import './style.styl'
import App from './components/App.vue'
import router from './router'
import './base.min.css'
import './fancy.min.css'

createApp(App).use(router).mount('#app')
