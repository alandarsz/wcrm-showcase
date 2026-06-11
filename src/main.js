import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import VueApexCharts from 'vue3-apexcharts';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import 'element-plus/dist/index.css';
import './styles/style.scss';
import './styles/tailwind.css';

// ── Bootstrap mock adapter (intercepts all axios calls with dummy data) ──
import './mock/mockHandler.js';

// ── Bootstrap dummy user session so router auth guard passes ──
import { menuList } from './mock/dummyMenu.js';

store.commit('setAuth', 'dummy-token-portfolio');
store.commit('setUser', {
  name: 'Yudha Pratama',
  code: 'SLS-001',
  id: 'USR-001',
  type: 'SLS',
  typer: 'SLS',
  aud: 'USR-001',
  exp: 9999999999,
  iat: 0,
  iss: 'wahana-crm-showcase',
  session: 'demo',
});
store.commit('setAccount', {
  accountCode: 'SLS-001',
  accountId: 'USR-001',
  accountName: 'Yudha Pratama',
  companyCode: 'WHN',
  companyId: 'COMP-001',
  companyName: 'PT Wahana Prestasi Logistik',
  companyDrpRole: {},
  drpRole: { roles: ['SLS'] },
  employmentRole: {},
  ownerCode: 'OWN-001',
  ownerId: 'OWN-001',
  ownerName: 'Wahana Express',
  tag: null,
  group: 'GRP-JKT',
});
store.commit('setJabatan', { label: 'Corporate Sales', value: 'SLS' });
store.commit('setMenuList', menuList);

localStorage.setItem('id', 'USR-001');
localStorage.setItem('role', 'SLS');
localStorage.setItem('group', 'GRP-JKT');
localStorage.setItem('menuList', JSON.stringify(menuList));

const app = createApp(App);

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(VueTelInput);
app.use(VueApexCharts);
app.component('VueApexCharts', VueApexCharts);

app.config.errorHandler = (err, vm, info) => {
  console.error("VUE_APP_ERROR:", err.stack);
  console.error("VUE_APP_INFO:", info);
};

app.mount('#app');