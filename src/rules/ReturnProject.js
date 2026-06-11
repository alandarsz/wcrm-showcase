import * as rules from '../helper/rules';
export const returnProjectRule = {
  PROJECT_MOVE_ORDER_CODE: [rules.requiredRule(), rules.minNumberRule(1), rules.maxNumberRule(50)],
  PROJECT_MOVE_ORDER_RETURN_DATE: [rules.requiredRule()],
  PROJECT_MOVE_ORDER_RETURN_REMARKS: [rules.requiredRule(), rules.maxStringRule(300)],
};

export const searchProjectMoveOrderCodeRule = {
  PROJECT_MOVE_ORDER_CODE: [rules.requiredRule()],
};
export const returnProjectLinesRule = {
  PROJECT_MOVE_ORDER_RETURN_QTY: [rules.minNumberRule(0)],
  PROJECT_MOVE_ORDER_RETURN_REMARKS: [rules.maxStringRule(300)],
};

export default {
  returnProjectRule,
  searchProjectMoveOrderCodeRule,
  returnProjectLinesRule,
};
