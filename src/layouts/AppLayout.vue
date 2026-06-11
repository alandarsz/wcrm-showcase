<template>
  <el-container v-if="isAuth && path != '/login' && showLeftSide()">
    <el-aside v-if="!isOnMobile">
      <slot name="side-bar"></slot>
    </el-aside>
    <el-container>
      <el-header class="header">
        <header-menu></header-menu>
      </el-header>
      <el-container v-if="!isOnMobile" class="max-h-[93vh]">
        <el-main class="bg-gray-200 p-2 md:px-5">
          <div class="bg-white p-2 md:px-5 rounded shadow-sm">
            <slot name="main-content"></slot>
          </div>
        </el-main>
        <el-footer
          class="flex justify-end items-center h-7 text-xs tracking-widest shadow-cus text-gray-500 z-10 font-light">Version
          {{ version }}</el-footer>
      </el-container>
      <template v-else>
        <el-main class="bg-gray-200 p-2">
          <div class="bg-white content p-2 md:px-5 rounded shadow-sm">
            <slot name="main-content"></slot>
          </div>
          <p class="text-center text-xs py-2 text-gray-500">
            Wahana CRM v. {{ version }}
          </p>
        </el-main>
        <el-footer>
          <slot name="mobile-footer"></slot>
        </el-footer>
      </template>
    </el-container>
  </el-container>
  <div v-else>
    <slot name="not-auth"></slot>
  </div>
</template>

<script setup>
import HeaderMenu from '../components/menu/HeaderMenu.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { version } from '../../package.json'
const store = useStore();
const route = useRoute();
const path = computed(() => route.path);
const isAuth = computed(() => store.getters.isAuth);
const isOnMobile = computed(() => store.getters.isOnMobile);
const isCollapse = computed(() => store.getters.isCollapse);

const toggleCollapse = () => {
  store.commit('setCollapse');
};
function showLeftSide() {
  return !path.value.includes('print/')
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}

.el-aside {
  width: auto;
  background-color: $primaryShade;
}

.shadow-cus {
  box-shadow: 2px -1px 5px -2px rgba(0, 0, 0, 0.4);
}
</style>
