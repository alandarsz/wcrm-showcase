<template>
  <div class="flex justify-between item mt-3 space-x-2">
    <div class="w-60">
      <el-form :rules="rules" :model="search">
        <el-form-item prop="search">
          <el-input placeholder="Search" :prefix-icon="Search" size="small" clearable v-model="search.search"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="w-60">
      <el-select v-model="record" placeholder="Records per page" size="small">
        <el-option label="10" value="10" />
        <el-option label="25" value="25" />
        <el-option label="50" value="50" />
        <el-option label="100" value="100" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Search } from '@element-plus/icons-vue';

const route = useRoute();
const defaultRecord = computed(() => (route.query.pageSize ? route.query.pageSize : import.meta.env.VITE_PAGE_SIZE));
const record = ref(defaultRecord.value);
const search = ref({ search: null });
const rules = {
  search: [
    {
      min: 3,
      message: 'Min 3 karakter',
      trigger: ['blur', 'change'],
    },
    {
      max: 150,
      message: 'Max 150 karakter',
      trigger: ['blur', 'change'],
    },
  ],
};
const searchValue = computed(() => search.value.search);

watch(record, (value) => {
  emit('paginate', value);
});

watch(searchValue, (value) => {
  if ((value.length >= rules.search[0].min && value.length <= rules.search[1].max) || value.length == 0) {
    createDebounce(value);
  }
});

let timeout = null;
function createDebounce(value) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('search', value);
  }, 500);
}

const emit = defineEmits(['search', 'paginate']);
</script>
