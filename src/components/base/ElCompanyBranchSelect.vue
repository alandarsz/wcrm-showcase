<template>
  <el-select-v2
    v-model="modelValue"
    filterable
    remote
    clearable
    placeholder="Pilih atau Cari Company Branch"
    :loading="companyBranchListLoading"
    :remote-method="queryCompanyBranchList"
    :options="listData"
    @focus="(!modelValue && listData.length < 5) || listData.length <= 1 ? queryCompanyBranchList('') : ''"
    @change="updateValue(modelValue)"
    @clear="updateValue(null)"
    style="width: 100%"
    :height="240"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { queryCompanyBranchList, companyBranchList as listData, companyBranchListLoading } from '../../helper/autoCompleteQuery';

const prop = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'handle-change']);

const modelV = computed(() => ref(prop.modelValue));
const modelValue = ref(modelV.value);

if (modelValue.value) {
  modelValue.value = parseInt(modelValue.value);
  setByID();
}

watch(modelV, (v) => {
  modelValue.value = v.value;
  if (v.value != undefined) {
    setByID();
  }
});

function setByID() {
  let isFound = false;
  if (listData.value.length) {
    listData.value.filter((list) => {
      if (list.value == modelValue.value) {
        isFound = true;
      }
    });
  }
  if (!isFound) {
    queryCompanyBranchList(modelValue.value.toString(), true);
  }
}

function updateValue(value) {
  emit('update:modelValue', value);
  listData.value.filter((list) => {
    if (list.value == value) {
      emit('handle-change', list);
    }
  });
}
</script>
