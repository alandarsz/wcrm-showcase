import { requiredRule, minNumberNotEqualRule } from '../helper/rules';

//header
export const addProductTransferRules = {
  INBRANCH_TRANSFER_FROM_WAREHOUSE_ID: [requiredRule()],
  INBRANCH_TRANSFER_TO_WAREHOUSE_ID: [requiredRule()],
  INBRANCH_TRANSFER_REMARK: [requiredRule()],
};

//line
export const addProductTransferLineRules = {
  INBRANCH_TRANSFER_CODE: [requiredRule()],
  INBRANCH_TRANSFER_LINE_ITEM_ID: [requiredRule()],
  INBRANCH_TRANSFER_LINE_UOM_ID: [requiredRule()],
  INBRANCH_TRANSFER_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
};

export default {
  addProductTransferRules,
  addProductTransferLineRules,
};
