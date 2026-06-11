import { axiosAuth, axiosAuthLong } from './axiosConfig';
import store from '../store';
import { computed } from 'vue';

export const initializeGlobalStateForLogInUser = (token, user) => {
  if (token) {
    store.commit('setAuth', token);
    axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axiosAuthLong.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  if (user) store.commit('setUser', user);
};

export const initializeGlobalState = (account, jabatan, leftMenu) => {
  if (leftMenu) store.commit('setMenuList', leftMenu);
  if (account) {
    store.commit('setAccount', account)
    if (account.ownerId) localStorage.setItem('ownerId', account.ownerId)
    if (account.group) localStorage.setItem('group', account.group)
    if (account.drpRole.roles[0]) localStorage.setItem('role', account.drpRole.roles[0])
    if (account.tag) localStorage.setItem('tag', account.tag)
  }
  if (jabatan) store.commit('setJabatan', jabatan)
}

export const currentMenuName = () => store.getters.currentMenuName;
const isOnMobile = computed(() => store.getters.isOnMobile);

export function labelPosition() {
  if (isOnMobile.value) return 'top';
  return 'left';
}

export function dialogWidth() {
  if (isOnMobile.value) return '95%';
  return '65%';
}

export function dialogWidthFlex() {
  return '95%';
}

export const updateMenuDetailPath = (path) => {
  // axiosAuth.defaults.headers.common['menu_detail_path'] = path != null || path != undefined ? path : '';
};

export function openWhatsApp(phone, name) {
  if (!phone) {
    console.warn('No phone number provided for WhatsApp');
    return;
  }
  // Remove any non-digit characters and ensure it starts with country code
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1); // Assume Indonesia
  }
  const message = name ? `Halo ${name}!` : 'Halo!';
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
