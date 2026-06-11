<template>
  <div class="w-full bg-gray-50 border border-dashed p-3 rounded">
    <div class="flex flex-col items-center cursor-pointer" @click="openInput">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="currentColor"
        class="bi bi-cloud-arrow-up-fill text-gray-400"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"
        />
      </svg>
      <span class="text-sm text-gray-500">Click to choose file</span>
      <input type="file" ref="inputRef" hidden @input="handleClick" :accept="accept" />
    </div>
    <div v-if="data" class="bg-lime-200 rounded px-4 py-1 text-sm text-lime-800 flex items-center space-x-2 mt-4">
      <span class="cursor-default">{{ data.name }}</span>
      <svg
        @click="clearData"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-x-circle-fill cursor-pointer"
        viewBox="0 0 16 16"
      >
        <path
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    required: true,
  },
  accept: {
    type: Array,
    default() {
      return [];
    },
  },
});

const emit = defineEmits(['update:modelValue', 'upload', 'clear']);
const inputRef = ref(null);
const data = ref(null);
const propsModelValue = computed(() => props.modelValue);

watch(propsModelValue, (value) => {
  data.value = value;
});

const handleClick = (event) => {
  emit('update:modelValue', event.target.files[0]);
  emit('upload', event.target.files[0]);
  inputRef.value.value = '';
};

function openInput() {
  inputRef.value.click();
}

function clearData() {
  data.value = null;
  emit('update:modelValue', null);
  emit('clear', null);
}
</script>
