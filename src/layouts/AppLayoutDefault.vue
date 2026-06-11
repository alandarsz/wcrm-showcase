<template>
  <el-container>
    <el-aside>
      <left-menu></left-menu>
    </el-aside>
    <el-container class="header">
      <el-header>
        <div class="expand-menu" @click="collapse">
          <el-icon v-if="isCollapse"><expand /></el-icon>
          <el-icon v-else><fold /></el-icon>
        </div>
      </el-header>

      <el-main>
        <slot />
      </el-main>
      <el-footer>
        <span>{{ appName }} v {{ appVersion }} </span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import LeftMenu from '../components/menu/LeftMenu.vue';
import { computed } from 'vue';
import { Expand, Fold } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import {version} from '../../package.json'

const store = useStore();
const isCollapse = computed(() => store.getters.isCollapse);
const collapse = () => store.commit('setCollapse');
const appName = computed(() => import.meta.env.VITE_APP_NAME);
const appVersion = computed(() => version);
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}
.el-aside {
  width: auto !important;
  background-color: #0b2c52;
}
</style>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-header {
  color: var(--el-text-color-primary);
  line-height: 56px;
  height: 52px;
  padding: 0;
  border-bottom: 1px solid #f0f0f0;
}
.expand-menu {
  font-size: 22px;
  height: 100%;
  float: left;
  padding: 0 15px;
  cursor: pointer;
  color: rgb(53, 53, 53);
}
.expand-menu:hover {
  color: #000;
}
.right-header-bar {
  text-align: right;
  font-size: 12px;
  float: right;
  padding-right: 20px;
  span {
    margin-bottom: 30px;
    padding-bottom: 15px;
  }
  display: flex;
  max-height: 52px;
}
.iconSetting {
  margin-top: 3px;
  margin-right: 5px;
  cursor: pointer;
  padding: 11px;
  font-size: 22px;
  color: rgb(53, 53, 53);
}
.iconSetting:hover {
  color: #000;
}
</style>
