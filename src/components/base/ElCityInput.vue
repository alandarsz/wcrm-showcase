<template>
  <el-select-v2
    v-model="modelValue"
    filterable
    remote
    clearable
    placeholder="Pilih atau Cari Kota/Kabupaten"
    :loading="cityLoading"
    :remote-method="(query) => queryCity(query, provinceId)"
    :options="listData"
    @focus="(!modelValue && listData.length < 5) || listData.length <= 1 ? queryCity('', provinceId) : ''"
    @change="updateValue(modelValue)"
    @clear="updateValue(null)"
    style="width: 100%"
    :height="240"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { queryCity, city as listData, cityLoading } from '../../helper/autoCompleteQuery';

const prop = defineProps(['modelValue', 'provinceId']);
const emit = defineEmits(['update:modelValue', 'handle-change']);

const modelV = computed(() => ref(prop.modelValue));
const modelValue = ref(modelV.value);

if (modelValue.value) {
  modelValue.value = modelValue.value;
  setByID();
}

watch(modelV, (v) => {
  modelValue.value = v.value;
  if (v.value != undefined) {
    setByID();
  }
});

watch(
  computed(() => ref(prop.provinceId)),
  (v) => {
    updateValue(null);
    queryCity('', v.value, true);
  },
);

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
    queryCity(modelValue.value.toString(), prop.provinceId);
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
