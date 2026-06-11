<template>
  <div class="demo-image__preview">
    <el-image
      class="w-10 h-10 object-cover rounded"
      :src="baseUrl+url"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="srcList.map(item => baseUrl+item)"
      show-progress
      :initial-index="4"
      fit="cover"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const baseUrl = import.meta.env.MODE == 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV
const props = defineProps({
    imageUrl: String || Array
})
const url = computed(() => Array.isArray(props.imageUrl) ? props.imageUrl[0] : props.imageUrl)
const srcList = computed(() => Array.isArray(props.imageUrl) ? props.imageUrl : [props.imageUrl])
</script>

<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
