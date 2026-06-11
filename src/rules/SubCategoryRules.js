export const subCategoryRules = {
  ITEM_CATEGORY_ID: [
    {
      required: true,
      message: 'Please select item category',
      trigger: 'change',
    },
  ],
  ITEM_SUB_CATEGORY_NAME: [
    {
      required: true,
      message: 'Please input sub category name',
      trigger: 'blur',
    },
    {
      min: 3,
      message: 'Sub Category name length should be at least 3 characters',
      trigger: ['blur', 'change'],
    },
  ],
};

export default subCategoryRules;
