<template>
  <div>
    <div class="h-16 flex justify-start items-center">
      <div class="ml-1" v-if="!isOnMobile" @click="setCollapse">
        <button class="relative group">
          <div
            class="relative flex overflow-hidden items-center justify-center w-[50px] h-[50px] transform transition-all duration-200">
            <div
              class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
              <div class="bg-primary h-[2px] w-1/2 transform transition-all duration-300 origin-left"
                :class="{ 'bg-red-500 w-7 rotate-[42deg]': !isCollapse }">
              </div>
              <div class="bg-primary h-[2px] w-7 rounded transform transition-all duration-300"
                :class="{ 'bg-red-500 translate-x-10': !isCollapse }">
              </div>
              <div class="bg-primary h-[2px] w-7 transform transition-all duration-300 origin-left"
                :class="{ 'bg-red-500 -rotate-[42deg]': !isCollapse }">
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
    <el-scrollbar>
      <el-menu 
      :active-text-color="scssConvert.textColor" 
      :background-color="scssConvert.primaryShade"
      :text-color="scssConvert.textColor" 
      :default-active="fullPath" 
      class="el-menu-vertical-demo"
      :collapse="isCollapse">
        <LeftMenuItem @click="clickMenu" v-for="route in leftMenu" :key="route.path" :item="route"></LeftMenuItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import LeftMenuItem from './LeftMenuItemV2.vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import variablesJs from '../../styles/variablesJs.scss';
import { dillScssExportToJson } from '../../helper/utils';
import { computed } from 'vue';
import { house } from '../../helper/svg';
import { Expand, Fold } from '@element-plus/icons-vue';
const scssConvert = dillScssExportToJson(variablesJs);
const store = useStore();
const router = useRouter();
const route = useRoute();
const isCollapse = computed(() => store.getters.isCollapse);
const clickMenu = (e) => {
  router.push(e.index);
};
const fullPath = computed(() => route.fullPath);
const leftMenu = computed(() => store.getters.menuList);
const isOnMobile = computed(() => store.getters.isOnMobile);
const setCollapse = () => {
  store.commit('setCollapse');
};

const isCurrentPath = (path) => {
  return route.path == path;
};

const toggleCollapse = () => {
  store.commit('setCollapse');
};
</script>

<style lang="scss" scoped>
.activeBg {
  background-color: $secondary;
}

.el-menu {
  padding: 0;
  margin: 0;
  border: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: $sideMenuWidth;
}

.logo {
  background: blue;
  display: flex;
  padding: 15px 0;
}

.logo>span {
  margin: 0 auto;
  text-align: center;
}

.el-menu-item-group__title {
  color: #536ea5 !important;
}

.collapse-btn {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  z-index: 1000;

  background: #ffffff;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  transition: 0.2s;
}

.collapse-btn:hover {
  background: #f5f5f5;
}
</style>
