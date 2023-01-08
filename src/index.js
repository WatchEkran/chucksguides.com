import { createApp } from 'vue'
// import './style.styl'
import App from './components/App.vue'
import router from './router'
// import '/src/assets/base.min.css'
// import '/src/assets/fancy.min.css'
import a10cAvif from '/src/assets/aircraft/dcs/A-10C.jpg?as=avif&width=500'
import a10cWebp from '/src/assets/aircraft/dcs/A-10C.jpg?as=webp&width=500'
import a10c from '/src/assets/aircraft/dcs/A-10C.jpg'
//import imageUrls from './assets/aircraft/**/*.*'

// Fix a console warning from Vue 3.
globalThis.__VUE_OPTIONS_API__ = process.env.NODE_ENV === 'development'
globalThis.__VUE_PROD_DEVTOOLS__ = process.env.NODE_ENV === 'development'

createApp(App).use(router).mount('#app')
