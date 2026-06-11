import { maxStringRule } from '../helper/rules';
import { requiredRule } from '../helper/rules';

export const addServiceProductCategoryRules = {
  SERVICE_PRODUCT_CATEGORY_NAME: [requiredRule(), maxStringRule(50)],
  SERVICE_PRODUCT_CATEGORY_FORECOLOR: [requiredRule(), maxStringRule(50)],
  SERVICE_PRODUCT_CATEGORY_BGCOLOR: [requiredRule(), maxStringRule(50)],
};

export const editServiceProductCategoryRules = {
  ...addServiceProductCategoryRules,
  SERVICE_PRODUCT_CATEGORY_ID: [requiredRule()],
};

export default {
  editServiceProductCategoryRules,
  addServiceProductCategoryRules,
};
