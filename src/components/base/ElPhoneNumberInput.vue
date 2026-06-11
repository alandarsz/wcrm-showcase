<template>
  <vue-tel-input
    v-model="displayValue"
    :default-country="defaultCountry"
    :preferred-countries="preferredCountries"
    :input-options="{ showDialCode: true }"
    @on-input="onInput"
    @validate="onValidate"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { VueTelInput } from 'vue-tel-input'

const props = defineProps({
  modelValue: String,
  defaultCountry: {
    type: String,
    default: 'ID'
  },
  preferredCountries: {
    type: Array,
    default: () => ['ID', 'MY', 'SG']
  }
})

const emit = defineEmits(['update:modelValue', 'valid'])

const displayValue = ref('')

const toDigits = (v) => v?.replace(/\D/g, '') || ''

/**
 * 🔥 SINKRON DARI PARENT → INPUT
 * kalau ada modelValue, tampilkan sebagai +number
 */
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      displayValue.value = ''
      return
    }

    // vue-tel-input lebih akurat kalau pakai format +62xxxx
    displayValue.value = '+' + toDigits(val)
  },
  { immediate: true }
)

/**
 * 🔥 INPUT → PARENT
 */
function onInput(value, phoneObject) {
  let digits = ''

  if (phoneObject?.number?.e164) {
    digits = phoneObject.number.e164.replace('+', '')
  } else if (phoneObject?.number?.international) {
    digits = toDigits(phoneObject.number.international)
  } else {
    digits = toDigits(value)
  }

  emit('update:modelValue', digits)
}

function onValidate(validation) {
  emit('valid', validation.valid)
}
</script>
