<template>
  <span class="dialog-footer">
    <el-button type="primary" @click="() => emit('save-click')" :loading="disableSave">{{ saveText }}</el-button>
    <el-button type="danger" :disabled="disableSave" @click="() => emit('cancel-click')">{{ cancelText }}</el-button>
  </span>
</template>

<script setup>
defineProps({
  saveText: {
    type: String,
    default: 'Simpan',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  disableSave: {
    type: Boolean,
    default: false,
  }
});
const emit = defineEmits(['save-click', 'cancel-click']);
</script>
