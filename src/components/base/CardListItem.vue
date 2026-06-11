<script setup>
import { inject, getCurrentInstance, onMounted } from 'vue'

const props = defineProps({
  prop: String,
  label: String,
  isSingleColumn: Boolean,
})

const register = inject('cardListRegister')
const instance = getCurrentInstance()

onMounted(() => {
  register({
    type: 'item',
    props,
    slots: instance.slots
  })
})
</script>

<template>
  <div></div>
</template>
