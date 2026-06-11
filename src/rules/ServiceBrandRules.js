import { maxStringRule } from '../helper/rules';
import { requiredRule } from '../helper/rules';

export const addServiceBrandRules = {
  SERVICE_PRODUCT_BRAND_NAME: [requiredRule(), maxStringRule(50)],
  SERVICE_PRODUCT_FORECOLOR: [requiredRule(), maxStringRule(50)],
  SERVICE_PRODUCT_BGCOLOR: [requiredRule(), maxStringRule(50)],
};

export const editServiceBrandRules = {
  ...addServiceBrandRules,
  SERVICE_PRODUCT_BRAND_ID: [requiredRule()],
};

export default {
  editServiceBrandRules,
  addServiceBrandRules,
};
