export const itemBrandRules = {
  ITEM_BRAND_NAME: [
    {
      required: true,
      message: 'Please input item brand name',
      trigger: 'blur',
    },
    {
      min: 1,
      message: 'Item brand name length should be at least 1 characters',
      trigger: ['blur', 'change'],
    },
  ],
};
