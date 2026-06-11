<template>
  <div>
    <!-- MOBILE -->
    <el-drawer
      v-if="isOnMobile"
      v-model="visible"
      :title="title"
      :before-close="handleBeforeClose"
      size="100%"
      direction="btt"
    >
      <slot />
      <template #footer>
        <slot name="footer" />
      </template>
    </el-drawer>

    <!-- DESKTOP -->
    <el-dialog
      v-else
      v-model="visible"
      :title="title"
      :width="dialogWidth()"
      destroy-on-close
      :before-close="handleBeforeClose"
    >
      <slot />
      <template #footer>
        <slot name="footer" />
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'
import { dialogWidth } from '../../helper/appUtils'

const store = useStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

/**
 * v-model bridge
 */
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isOnMobile = computed(() => store.getters.isOnMobile)

/**
 * confirm before close
 */
const handleBeforeClose = (done) => {
  ElMessageBox.confirm(
    'Apakah anda yakin ingin menutup?',
    'Konfirmasi',
    {
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'warning',
    }
  )
    .then(() => {
      done()
    })
    .catch(() => {
      // cancel -> do nothing
    })
}
</script>