<template>
  <div class="flex justify-between my-1 border-b pb-2 text-center">
    <div class="flex items-center min-h-[35px]">
      <button v-if="showBackButton" class="mr-8" @click="onBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </button>
      <h1 class="tracking-wide capitalize">{{ title ? title : currentMenuName }}</h1>
      <div v-if="showPickYear" class="pl-2">
        <el-date-picker v-model="year" @change="() => emit('handleYearChange', year)" type="year" />
      </div>
    </div>
    <slot name="btn1"></slot>
    <el-button v-if="showButton" type="primary" @click="() => emit('click')">{{ btnText }}</el-button>
    <el-tag v-if="showTag" class="xl:ml-2" type="info">{{ tagText }}</el-tag>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
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
  showButton: {
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
  showPickYear: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['click', 'handleYearChange']);
const year = ref(new Date());
function onBack() {
  router.back();
}
</script>
