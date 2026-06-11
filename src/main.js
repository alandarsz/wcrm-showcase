import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Import Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Import ApexCharts
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

// Register Element Plus Icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.use(VueApexCharts)

app.mount('#app')
