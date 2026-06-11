export const categoryRules = {
  ITEM_TYPE_ID: [
    {
      required: true,
      message: 'Please select item type',
      trigger: 'change',
    },
  ],
  ITEM_CATEGORY_NAME: [
    {
      required: true,
      message: 'Please input category name',
      trigger: 'blur',
    },
    {
      min: 3,
      message: 'Category name length should be at least 3 characters',
      trigger: ['blur', 'change'],
    },
  ],
  ITEM_ACCOUNT_ID: [
    {
      required: true,
      message: 'Please select account',
      trigger: 'change',
    },
  ],
};

export default {
  categoryRules
}
