<template>
    <div class="flex items-center justify-center h-64">
      <span
        class="loader"
        :class="sizeClass"
      ></span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    size: {
      type: String,
      default: 'md', // md | sm
    },
  })
  
  const sizeClass = computed(() => {
    return props.size === 'sm' ? 'loader-sm' : 'loader-md'
  })
  </script>
  
  <style scoped>
  .loader {
    border-style: solid;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  /* DEFAULT */
  .loader-md {
    width: 48px;
    height: 48px;
    border-width: 4px;
    border-color: #e5e7eb;
    border-top-color: #6366f1;
  }
  
  /* SMALL */
  .loader-sm {
    width: 24px;
    height: 24px;
    border-width: 3px;
    border-color: #e5e7eb;
    border-top-color: #6366f1;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  