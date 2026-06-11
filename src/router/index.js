import { createRouter, createWebHistory } from 'vue-router';
import routeList from './routeList';
import store from '../store';
import { toRaw } from 'vue';

function parsePath(path) {
  try {
    const parse = JSON.parse(path);
    return parse.path || '/';
  } catch {
    return path || '/';
  }
}

const routes = routeList;

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  // Update page title
  document.title = to.meta?.title ? `${to.meta.title} — Wahana CRM` : 'Wahana CRM';

  // DEMO MODE: always authenticated, allow all routes except login redirect to dashboard
  const isAuth = store.getters.isAuth;

  if (!isAuth) {
    // should not happen since we bootstrap auth in main.js, but just in case
    if (to.path !== '/login') return '/dashboard';
    return true;
  }

  // Update active menu in store for sidebar highlight
  const [menu] = to.fullPath.substring(1).split('/');
  const leftMenu = toRaw(store.getters.menuList || []);
  const currentMenu = leftMenu.find((element) => {
    const menuWithoutQuery = menu.split('?')[0];
    return element.items?.find((item) => {
      return parsePath(item.route) === menuWithoutQuery ||
        element?.parentMenu?.replace(/\s+/g, '-')?.toLowerCase() === menuWithoutQuery;
    });
  });
  store.commit('setActiveMenu', currentMenu);

  // Redirect login page to dashboard
  if (to.path === '/login' || to.path === '/home') return '/dashboard';

  return true;
});

export default router;
