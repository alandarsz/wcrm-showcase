import { requiredRule } from '../helper/rules';
import { maxStringRule } from '../helper/rules';

export const addWareHouseRules = {
  WAREHOUSE_NAME: [requiredRule(), maxStringRule(150)],
  NOTE: [maxStringRule(150)],
};

export const editWareHouseRules = {
  WAREHOUSE_ID: [requiredRule()],
  WAREHOUSE_NAME: [requiredRule, maxStringRule(150)],
  NOTE: [maxStringRule(150)],
};
