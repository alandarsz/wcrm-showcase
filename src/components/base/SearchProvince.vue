<template>
  <el-autocomplete
    v-model="searchState"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="false"
    class="inline-input w-full"
    placeholder=" "
    @select="handleSelect"
  />
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { catchErrorLog } from '../../helper/catchResp';

const emit = defineEmits(['search']);
const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  originValue: {
    type: String,
    default: '',
  }
})
const searchState = ref(null);


const querySearch = (keyword, cb) => {
  catchErrorLog(async () => {
    const { data } = await props.api(keyword);
    const result = [];
    data.data.list.forEach((element) => {
      result.push({ value: element.PROVINCE_NAME, id: element.PROVINCE_ID });
    });
    cb(result);
  });
};

onMounted(() => {
  if(props.originValue) {
    searchState.value = props.originValue
  }
})


const handleSelect = (selectedValue) => {
  emit('search', selectedValue);
};
</script>
