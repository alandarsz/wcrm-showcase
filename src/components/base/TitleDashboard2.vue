<template>
  <div class="block md:flex justify-between my-1 border-b pb-2 text-center space-y-3 md:space-y-0">
    <div class="flex items-center">
      <button v-if="showBackButton" class="mr-8" @click="onBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </button>
      <h1 class="tracking-wide capitalize font-semibold text-sm">{{ title ? title : currentMenuName }}</h1>
    </div>
    <div>
      <slot name="btn1"></slot>
      <el-button v-if="showButton" :disabled="isDisabled" type="primary" size="small" @click="() => emit('click')">{{ btnText }}</el-button>
      <el-button v-if="showButton2" :disabled="isDisabled" type="primary" size="small" @click="() => emit('click2')">{{ btnText2 }}</el-button>
      <el-tag v-if="showTag" class="xl:ml-2" type="info">{{ tagText }}</el-tag>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();
const currentMenuName = computed(() => store.getters.currentMenuName);
defineProps({
  title: {
    type: String,
    default: '',
  },
  btnText: {
    type: String,
    default: 'Tambah',
  },
  btnText2: {
    type: String,
    default: 'Tambah',
  },
  showButton: {
    type: Boolean,
    default: false,
  },
  showButton2: {
    type: Boolean,
    default: false,
  },
  showTag: {
    type: Boolean,
    default: false,
  },
  tagText: {
    type: String,
    default: '',
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  typeButton: {
    type: String,
    default: 'primary',
  },
});
const emit = defineEmits(['click', 'click2']);

function onBack() {
  router.back();
}
</script>
