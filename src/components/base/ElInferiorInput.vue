<template>
  <el-select-v2
    v-model="modelValue"
    filterable
    remote
    clearable
    placeholder="Pilih atau Cari Sales"
    :loading="inferiorListLoading"
    :remote-method="(q) => queryInferiorList(q, prop.userId, prop.groupId, prop.role)"
    :options="listData"
    @focus="(!modelValue && listData.length < 5) || listData.length <= 1 ? queryInferiorList('', prop.userId, prop.groupId, prop.role) : ''"
    @change="updateValue(modelValue)"
    @clear="updateValue(null)"
    style="width: 100%"
    reserve-keyword
    :height="240"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { queryInferiorList, inferiorList as listData, inferiorListLoading } from '../../helper/autoCompleteQuery';

const prop = defineProps(['modelValue', 'userId', 'groupId', 'role']);
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
  console.log(modelValue.value);
  
  let isFound = false;
  if (listData.value.length) {
    listData.value.filter((list) => {
      if (list.value == modelValue.value) {
        isFound = true;
      }
    });
  }
  if (!isFound) {
    queryInferiorList(modelValue.value.toString(), prop.userId, true);
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

defineExpose({
  setByID,
  updateValue
});

</script>
