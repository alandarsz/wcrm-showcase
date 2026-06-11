<template>
  <div class="flex justify-center items-center flex-col space-y-5">
    <h1 class="text-white font-light text-3xl tracking-widest">Data tidak ditemukan!</h1>
    <span class="text-white tracking-widest font-light text-xs uppercase">{{ appName }}</span>
  </div>
</template>


<script setup>
import { computed } from 'vue';
const appName = computed(() => import.meta.env.VITE_APP_NAME);
</script>
