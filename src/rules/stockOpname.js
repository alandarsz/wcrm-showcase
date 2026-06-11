import { requiredRule, minNumberRule, maxStringRule, minNumberNotEqualRule } from '../helper/rules';

export const addMaster = {
  WAREHOUSE_ID: [requiredRule()],
  OPNAME_ACCOUNT_ID: [requiredRule()],
  OPNAME_REMARKS: [requiredRule(), maxStringRule(150)],
};
export const editMaster = {
  WAREHOUSE_ID: [requiredRule()],
  OPNAME_ACCOUNT_ID: [requiredRule()],
  OPNAME_REMARKS: [requiredRule(), maxStringRule(150)],
};
export const addLine = {
  OPNAME_LINE_ITEM_ID: [requiredRule()],
  OPNAME_LINE_REAL_STOCK_QTY: [requiredRule(), minNumberRule(0)],
  OPNAME_LINE_REMARKS: [requiredRule(), maxStringRule(300)],
};
export const editLine = {
  OPNAME_LINE_ITEM_ID: [requiredRule()],
  OPNAME_LINE_REAL_STOCK_QTY: [requiredRule(), minNumberRule(0)],
  OPNAME_LINE_REMARKS: [requiredRule(), maxStringRule(300)],
};

export default {
  addMaster,
  editMaster,
  addLine,
  editLine,
};
