<template>
  <div class="bg w-full h-screen flex items-center justify-center">
    <div class="flex justify-center items-center flex-col space-y-5">
      <h1 class="text-white font-light text-3xl tracking-widest uppercase">{{ appName }}</h1>
      <el-button type="danger" size="large" @click="$router.push('/login')">Sign in</el-button>
      <span class="text-white tracking-widest font-light">Version {{ appVersion }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {version} from '../../../package.json'

const appName = computed(() => import.meta.env.VITE_APP_NAME);
const appVersion = computed(() => version);
</script>

<style lang="scss" scoped>
.bg {
  background: #005c97; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #363795, #005c97); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #363795, #005c97); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
