import { createApp } from 'vue'
import { createPinia } from 'pinia'

// elementplus
import ElementPlus from 'element-plus' // 组件库
import 'element-plus/dist/index.css' // 样式库

// 路由
import router from './router'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

// 注册elementplus
app.use(ElementPlus)

// 注册路由
app.use(router)

app.mount('#app')
