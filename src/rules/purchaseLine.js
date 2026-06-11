import { requiredRule } from '../helper/rules';
import { maxStringRule, minNumberRule, minNumberNotEqualRule } from '../helper/rules';

export const purchaseLineInsert = {
  PURCHASE_LINE_ITEM_ID: [requiredRule()],
  ITEM_NAME: [requiredRule()],
  PURCHASE_LINE_UOM_ID: [requiredRule()],
  PURCHASE_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  PURCHASE_LINE_ITEM_PRICE: [requiredRule(), minNumberRule(0)],
  PURCHASE_LINE_DISC_PERCENTAGE: [requiredRule(), minNumberRule(0)],
  PURCHASE_LINE_DISC_AMOUNT: [requiredRule(), minNumberRule(0)],
  PURCHASE_LINE_DISC_TOTAL_AMOUNT: [requiredRule(), minNumberRule(0)]
};

export const purchaseLineEdit = {
  PURCHASE_ID: [requiredRule()],
  ITEM_NAME: [requiredRule()],
  PURCHASE_LINE_ID: [requiredRule()],
  PURCHASE_LINE_ITEM_ID: [requiredRule()],
  PURCHASE_LINE_UOM_ID: [maxStringRule(50), requiredRule()],
  PURCHASE_LINE_QTY: [requiredRule(), minNumberNotEqualRule(0)],
  PURCHASE_LINE_ITEM_PRICE: [requiredRule(), minNumberRule(0)],
  PURCHASE_LINE_DISC_PERCENTAGE: [requiredRule(), minNumberRule(0)],
  PURCHASE_LINE_DISC_AMOUNT: [requiredRule(), minNumberRule(0)],
  PURCHASE_LINE_DISC_TOTAL_AMOUNT: [requiredRule(), minNumberRule(0)]
};

export default {
  purchaseLineInsert,
  purchaseLineEdit,
};
