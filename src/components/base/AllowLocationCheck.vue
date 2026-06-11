<template>
  <el-drawer
    v-model="drawerVisible"
    title="Aktifkan Lokasi"
    direction="btt"
    size="30%"
    :with-header="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :before-close="handleBeforeClose"
  >
    <div class="content">
      <p>
        Aplikasi membutuhkan akses lokasi Anda.
        Silakan aktifkan GPS dan izinkan akses lokasi untuk melanjutkan.
      </p>

      <el-button
        type="primary"
        size="large"
        @click="checkLocation"
      >
        Cek Ulang Lokasi
      </el-button>
    </div>
  </el-drawer>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const drawerVisible = ref(false)

const handleBeforeClose = () => {
  // Blokir semua upaya close
  return false
}

const checkLocation = () => {
  if (!navigator.geolocation) {
    ElMessage.error('Browser tidak mendukung GPS')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      // console.log('Lokasi didapat:', position)
      drawerVisible.value = false
      ElMessage.success('Lokasi berhasil diaktifkan')
    },
    (error) => {
      // console.log('Error lokasi:', error)
      drawerVisible.value = true
      ElMessage.warning('Silakan aktifkan GPS dan izinkan akses lokasi')
    }
  )
}

onMounted(() => {
  checkLocation()
})
</script>
<style scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  text-align: center;
  padding: 20px;
}
</style>