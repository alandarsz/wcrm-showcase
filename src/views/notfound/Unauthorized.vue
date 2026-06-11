<template>
  <div v-if="isAuth" class="">
    <div class="my-20 text-center">
      <h1 class="text-5xl text-gray-300 tracking-wide">401</h1>
      <p class="font-light text-gray-400 tracking-wider text-sm mt-2">Unauthorized</p>
    </div>
  </div>
  <!-- <div v-else class="bg w-full h-screen flex items-center justify-center">
    <div class="flex justify-center items-center flex-col space-y-5">
      <h1 class="text-white font-light text-3xl tracking-widest">401: Unauthorized</h1>
      <span class="text-white tracking-widest font-light text-xs uppercase">{{ appName }}</span>
    </div>
  </div> -->
  <div v-else class="bg w-full h-screen flex items-center justify-center">
    <div class="flex justify-center items-center flex-col space-y-5">
      <div class="flex items-center justify-center">
      <img src="/401.png" alt="error" />
    </div>
      <span class="text-white tracking-widest font-light text-xs uppercase">{{ appName }}</span>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const appName = computed(() => import.meta.env.VITE_APP_NAME);
const store = useStore();
const isAuth = computed(() => store.getters.isAuth);
</script>

<style lang="scss" scoped>
.bg {
  background: #0f2027; /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #2c5364, #203a43, #0f2027); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #2c5364, #203a43, #0f2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
