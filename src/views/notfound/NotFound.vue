<template>
  <div v-if="isAuth">
    <div class="my-20 text-center">
      <div class="flex items-center justify-center">
        <img src="/404.png" alt="error" class="max-w-xs" />
      </div>

      <!-- Text -->
      <p class="mt-6 text-gray-500 text-lg font-medium">Halaman tidak tersedia</p>

      <!-- Button -->
      <router-link to="/dashboard">
        <el-button type="primary" class="mt-6 px-8 py-3 font-semibold" :style="{ backgroundColor: '#001BB7', borderColor: '#001BB7' }">
          Kembali ke Dashboard
        </el-button>
      </router-link>
    </div>
  </div>

  <!-- <div v-else class="bg w-full h-screen flex items-center justify-center">
    <div class="flex justify-center items-center flex-col space-y-5">
      <h1 class="text-white font-light text-3xl tracking-widest">404: Page Not Found</h1>
      <span class="text-white tracking-widest font-light text-xs uppercase">{{ appName }}</span>
    </div>
  </div> -->
  <div v-else class="bg w-full h-screen flex items-center justify-center">
    <div class="my-20 text-center">
      <div class="flex items-center justify-center">
        <img src="/404.png" alt="error" />
      </div>

      <!-- Text -->
      <p class="mt-6 text-white text-lg font-medium">Halaman tidak tersedia</p>

      <!-- Button -->
      <router-link to="/login">
        <el-button type="primary" class="mt-6 px-8 py-3 font-semibold" :style="{ backgroundColor: '#001BB7', borderColor: '#001BB7' }">
          Login Page
        </el-button>
      </router-link>
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
