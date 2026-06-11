<template>
  <div class="w-full grid md:grid-cols-2 grid-cols-1 space-x-2">
    <el-company-select v-model="modelCompany" @clear="onClearTable" @handle-change="onSelectCompany" :props="{ value: 'id' }"></el-company-select>
    <el-table-select v-model="modelTable" @clear="onClearTable" @handle-change="onSelectActive" :company-id="modelCompany" :disabled="!modelCompany"></el-table-select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ElCompanySelect from './ElCompanySelect.vue';
import ElTableSelect from './ElTableSelect.vue';

const prop = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  companyId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'update:companyId', 'selectActive']);

function onClearTable() {
  emit('update:modelValue', null);
  emit('update:companyId', null);
}

function onSelectCompany(v) {
  emit('update:companyId', v.id);
}

function onSelectActive(v) {
  emit('update:modelValue', v.value);
  emit('selectActive', v);
}

const modelCompanyV = ref(prop.companyId);
const modelTableV = ref(prop.modelValue);

const modelCompany = ref(modelCompanyV.value);
const modelTable = ref(modelTableV.value);
</script>
