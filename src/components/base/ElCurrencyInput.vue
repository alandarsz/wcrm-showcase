<template>
  <el-input ref="inputRef" v-model="formattedValue" />
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input';
import { watch } from 'vue';
export default {
  name: 'ElCurrencyInput',
  props: {
    modelValue: Number,
  },
  setup(props) {
    const options = {
      currency: 'IDR',
      locale: 'id',
      useGrouping: true,
      hideCurrencySymbolOnFocus: false,
      hideGroupingSeparatorOnFocus: false,
      hideNegligibleDecimalDigitsOnFocus: false,
    };

    const { inputRef, formattedValue, setValue } = useCurrencyInput(options);

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value);
      },
    );

    return { inputRef, formattedValue };
  },
};
</script>
