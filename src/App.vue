<template>
  <main>
    <AppLayout>
      <template #main-content>
        <router-view></router-view>
      </template>
      <template #side-bar>
        <LeftMenu></LeftMenu>
      </template>
      <template #not-auth>
        <router-view></router-view>
      </template>
      <template #mobile-footer>
        <BottomNav></BottomNav>
      </template>
    </AppLayout>
  </main>
</template>

<script setup>
import AppLayout from './layouts/AppLayout.vue';
import LeftMenu from './components/menu/LeftMenu.vue';
import BottomNav from './components/menu/BottomNav.vue';
import { useStore } from 'vuex';
import { watchEffect, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { updateMenuDetailPath } from './helper/appUtils';

const route = useRoute();
const store = useStore();
const isAuth = computed(() => store.getters.isAuth);

const title = computed(() => route.meta?.title);
if (title.value) document.title = title.value;
watch(title, (value) => {
  if (value) document.title = value;
});

if (window.innerWidth <= 768) {
  store.commit('setOnMobile');
}

watchEffect(() => {
  if (route.name) {
    try {
      updateMenuDetailPath(route.name);
    } catch (e) {
      // ignore helper error
    }
  }
});
</script>
