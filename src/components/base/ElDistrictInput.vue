<template>
  <el-select-v2 v-model="modelValue" filterable remote clearable placeholder="Pilih atau Cari Kecamatan"
    :loading="districtListLoading" :remote-method="(query) => queryDistrictList(query, cityId, provinceId)" :options="listData"
    @focus="(!modelValue && listData.length < 5) || listData.length <= 1 ? queryDistrictList('', cityId, provinceId) : ''"
    @change="updateValue(modelValue)" @clear="updateValue(null)" style="width: 100%" :height="240"
    :disabled="!cityId" />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { queryDistrictList, districtList as listData, districtListLoading } from '../../helper/autoCompleteQuery';

const prop = defineProps(['modelValue', 'cityId', 'provinceId']);
const emit = defineEmits(['update:modelValue', 'handle-change']);

const modelV = computed(() => ref(prop.modelValue));
const modelValue = ref(modelV.value);

if (modelValue.value) {
  modelValue.value = parseInt(modelValue.value);
  setByID();
}

watch(modelV, (v) => {
  modelValue.value = v.value
  if (v.value != undefined) {
    setByID();
  }
});

watch(
  computed(() => ref(prop.cityId)),
  (v) => {
    updateValue(null);
    queryDistrictList('', v.value, prop.provinceId, true);
  },
);

watch(
  computed(() => ref(prop.provinceId)),
  (v) => {
    updateValue(null);
    queryDistrictList('', prop.cityId, v.value, true);
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
    queryDistrictList(modelValue.value.toString(), prop.cityId, prop.provinceId);
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
