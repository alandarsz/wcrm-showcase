<template>
  <div class="flex space-x-5 my-3">
    <div class="bg-blue-500 w-10 h-10 flex items-center justify-center text-white rounded">
      <div v-html="getIcon(type)" class="icon"></div>
    </div>
    <div>
      <h3 class="tracking-wide font-medium text-sm">{{ title }}</h3>
      <span class="text-gray-500 text-sm">{{ type == 'svc-in' || type == 'svc-out' ? amount  : convertRp(amount) }}</span>
    </div>
  </div>
</template>

<script setup>
import { convertRp } from '../../helper/utils';
import ICON from '../../helper/svg';
defineProps({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: 'none',
  },
});

function getIcon(type) {
  if (type == 'sell') return ICON.sell;
  if (type == 'buy') return ICON.buy;
  if (type == 'svc-in') return ICON.svcIn;
  if (type == 'svc-out') return ICON.svcOut;
  if(type == 'credit') return ICON.credit;
  if(type == 'debt') return ICON.debt
  return ICON.none;
}
</script>

<style lang="scss" scoped>
.icon {
  width: 20px;
  height: 20px;
}
</style>
