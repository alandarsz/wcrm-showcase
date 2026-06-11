<template>
  <div class="w-full">
    <div style="display:none">
      <slot />
    </div>
    <div v-for="(row, rowIndex) in list" :key="rowIndex" class="mb-4 p-4 border bg-gray-50" :class="{'rounded-xl': isRounded}">
      <div class="grid grid-cols-2 gap-2">

        <!-- CardListItem -->
        <div v-for="(item, i) in items" :key="i" :class="{'col-span-2': item.props.isSingleColumn}">
          <p class="text-xs text-gray-500" v-if="item.props.label">{{ item.props.label }}</p>

          <!-- custom slot -->
          <component v-if="item.slots.default" :is="item.slots.default" :row="row" />

          <!-- default render -->
          <p v-else class="font-semibold">
            {{ row[item.props.prop] }}
          </p>  
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'

const props = defineProps({
  list: Array,
  isRounded: Boolean
})

const items = ref([])

function register(entry) {
  items.value.push(entry)
}

provide('cardListRegister', register)
</script>
